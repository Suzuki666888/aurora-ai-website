#!/bin/bash

# Aurora云服务器部署脚本
# 支持阿里云、腾讯云、AWS等主流云服务商

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 配置变量
SERVER_IP=""
SERVER_USER="root"
SERVER_PORT="22"
DOMAIN=""
SSL_EMAIL=""

# 日志函数
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查参数
check_params() {
    if [ -z "$SERVER_IP" ]; then
        log_error "请设置服务器IP地址"
        echo "用法: SERVER_IP=1.2.3.4 $0"
        exit 1
    fi
}

# 安装Docker和Docker Compose
install_docker() {
    log_info "安装Docker和Docker Compose..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP << 'EOF'
        # 更新系统
        apt update && apt upgrade -y
        
        # 安装Docker
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        
        # 安装Docker Compose
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        
        # 启动Docker服务
        systemctl start docker
        systemctl enable docker
        
        # 添加用户到docker组
        usermod -aG docker $USER
EOF
    
    log_success "Docker安装完成"
}

# 配置防火墙
setup_firewall() {
    log_info "配置防火墙..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP << 'EOF'
        # 安装ufw
        apt install ufw -y
        
        # 配置防火墙规则
        ufw default deny incoming
        ufw default allow outgoing
        ufw allow ssh
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw allow 3000/tcp
        ufw allow 8000/tcp
        ufw allow 3001/tcp
        
        # 启用防火墙
        ufw --force enable
EOF
    
    log_success "防火墙配置完成"
}

# 上传项目文件
upload_project() {
    log_info "上传项目文件..."
    
    # 创建项目目录
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "mkdir -p /opt/aurora"
    
    # 上传文件
    rsync -avz -e "ssh -p $SERVER_PORT" \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude 'logs' \
        --exclude 'data' \
        ./ $SERVER_USER@$SERVER_IP:/opt/aurora/
    
    log_success "项目文件上传完成"
}

# 配置环境变量
setup_env() {
    log_info "配置环境变量..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP << EOF
        cd /opt/aurora
        
        # 创建生产环境配置
        cat > .env << 'ENVEOF'
# 生产环境配置
NODE_ENV=production
PORT=3000

# 数据库配置
DB_HOST=postgres
DB_PORT=5432
DB_NAME=aurora_db
DB_USER=aurora_user
DB_PASSWORD=aurora_password_$(openssl rand -hex 8)

# Redis配置
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_$(openssl rand -hex 8)

# MongoDB配置
MONGO_URI=mongodb://aurora_admin:mongodb_password_$(openssl rand -hex 8)@mongodb:27017/aurora_chat

# JWT配置
JWT_SECRET=jwt_secret_$(openssl rand -hex 32)
JWT_EXPIRES_IN=7d

# API配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# 监控配置
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
ENVEOF
EOF
    
    log_success "环境变量配置完成"
}

# 配置Nginx
setup_nginx() {
    log_info "配置Nginx..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP << EOF
        cd /opt/aurora
        
        # 创建Nginx配置
        mkdir -p nginx
        cat > nginx/nginx.conf << 'NGINXEOF'
events {
    worker_connections 1024;
}

http {
    upstream api_gateway {
        server api-gateway:3000;
    }
    
    upstream emotion_service {
        server emotion-service:8000;
    }
    
    upstream chat_service {
        server chat-service:3001;
    }
    
    server {
        listen 80;
        server_name $DOMAIN;
        
        # 重定向到HTTPS
        return 301 https://\$server_name\$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name $DOMAIN;
        
        # SSL配置
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        
        # API Gateway
        location /api/ {
            proxy_pass http://api_gateway/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # Emotion Service
        location /emotion/ {
            proxy_pass http://emotion_service/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # Chat Service
        location /chat/ {
            proxy_pass http://chat_service/;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
        
        # 健康检查
        location /health {
            proxy_pass http://api_gateway/health;
        }
    }
}
NGINXEOF
EOF
    
    log_success "Nginx配置完成"
}

# 配置SSL证书
setup_ssl() {
    if [ -n "$DOMAIN" ] && [ -n "$SSL_EMAIL" ]; then
        log_info "配置SSL证书..."
        
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP << EOF
            # 安装Certbot
            apt install certbot python3-certbot-nginx -y
            
            # 获取SSL证书
            certbot --nginx -d $DOMAIN --email $SSL_EMAIL --agree-tos --non-interactive
            
            # 设置自动续期
            echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
EOF
        
        log_success "SSL证书配置完成"
    else
        log_warning "跳过SSL配置（需要设置DOMAIN和SSL_EMAIL）"
    fi
}

# 启动服务
start_services() {
    log_info "启动Aurora服务..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP << 'EOF'
        cd /opt/aurora
        
        # 构建并启动服务
        docker-compose down
        docker-compose build
        docker-compose up -d
        
        # 等待服务启动
        sleep 30
        
        # 检查服务状态
        docker-compose ps
EOF
    
    log_success "Aurora服务启动完成"
}

# 配置监控
setup_monitoring() {
    log_info "配置监控系统..."
    
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP << 'EOF'
        cd /opt/aurora
        
        # 创建Prometheus配置
        mkdir -p monitoring
        cat > monitoring/prometheus.yml << 'PROMEOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'aurora-api'
    static_configs:
      - targets: ['api-gateway:3000']
  
  - job_name: 'aurora-emotion'
    static_configs:
      - targets: ['emotion-service:8000']
  
  - job_name: 'aurora-chat'
    static_configs:
      - targets: ['chat-service:3001']
PROMEOF
        
        # 重启监控服务
        docker-compose restart prometheus grafana
EOF
    
    log_success "监控系统配置完成"
}

# 显示部署信息
show_info() {
    log_success "🎉 Aurora云服务器部署完成！"
    echo ""
    echo "服务访问地址："
    if [ -n "$DOMAIN" ]; then
        echo "  🌐 主站: https://$DOMAIN"
        echo "  📡 API: https://$DOMAIN/api"
        echo "  🧠 情感分析: https://$DOMAIN/emotion"
        echo "  💬 聊天服务: https://$DOMAIN/chat"
    else
        echo "  📡 API Gateway: http://$SERVER_IP:3000"
        echo "  🧠 Emotion Service: http://$SERVER_IP:8000"
        echo "  💬 Chat Service: http://$SERVER_IP:3001"
    fi
    echo ""
    echo "监控服务："
    echo "  📊 Prometheus: http://$SERVER_IP:9090"
    echo "  📈 Grafana: http://$SERVER_IP:3001"
    echo ""
    echo "管理命令："
    echo "  SSH连接: ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP"
    echo "  查看日志: ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP 'cd /opt/aurora && docker-compose logs -f'"
    echo "  重启服务: ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP 'cd /opt/aurora && docker-compose restart'"
    echo ""
    log_warning "请确保修改.env文件中的敏感配置信息！"
}

# 主函数
main() {
    log_info "🚀 开始部署Aurora到云服务器..."
    
    check_params
    install_docker
    setup_firewall
    upload_project
    setup_env
    setup_nginx
    setup_ssl
    start_services
    setup_monitoring
    show_info
}

# 处理命令行参数
case "${1:-}" in
    "deploy")
        main
        ;;
    "update")
        log_info "更新Aurora服务..."
        upload_project
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd /opt/aurora && docker-compose down && docker-compose build && docker-compose up -d"
        log_success "服务更新完成"
        ;;
    "logs")
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd /opt/aurora && docker-compose logs -f"
        ;;
    "status")
        ssh -p $SERVER_PORT $SERVER_USER@$SERVER_IP "cd /opt/aurora && docker-compose ps"
        ;;
    *)
        echo "Aurora云服务器部署脚本"
        echo ""
        echo "用法: SERVER_IP=1.2.3.4 [DOMAIN=example.com] [SSL_EMAIL=admin@example.com] $0 [命令]"
        echo ""
        echo "命令:"
        echo "  deploy  完整部署"
        echo "  update  更新服务"
        echo "  logs    查看日志"
        echo "  status  查看状态"
        echo ""
        echo "示例:"
        echo "  SERVER_IP=1.2.3.4 $0 deploy"
        echo "  SERVER_IP=1.2.3.4 DOMAIN=aurora.example.com SSL_EMAIL=admin@example.com $0 deploy"
        ;;
esac
