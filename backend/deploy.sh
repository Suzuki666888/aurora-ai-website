#!/bin/bash

# Aurora后端部署脚本
# 用于快速部署Aurora情感AI后端服务

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 命令未找到，请先安装 $1"
        exit 1
    fi
}

# 检查环境
check_environment() {
    log_info "检查部署环境..."
    
    # 检查必要的命令
    check_command "docker"
    check_command "docker-compose"
    check_command "node"
    check_command "npm"
    check_command "python3"
    check_command "pip3"
    
    # 检查Node.js版本
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js版本过低，需要18+版本"
        exit 1
    fi
    
    # 检查Python版本
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1)
    if [ "$PYTHON_VERSION" -lt 3 ]; then
        log_error "Python版本过低，需要3.9+版本"
        exit 1
    fi
    
    log_success "环境检查通过"
}

# 创建必要的目录
create_directories() {
    log_info "创建必要的目录..."
    
    mkdir -p logs
    mkdir -p models
    mkdir -p data/postgres
    mkdir -p data/redis
    mkdir -p data/mongodb
    mkdir -p nginx/ssl
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    
    log_success "目录创建完成"
}

# 安装Node.js依赖
install_node_dependencies() {
    log_info "安装Node.js依赖..."
    
    if [ -f "package.json" ]; then
        npm install
        log_success "Node.js依赖安装完成"
    else
        log_warning "未找到package.json文件"
    fi
}

# 安装Python依赖
install_python_dependencies() {
    log_info "安装Python依赖..."
    
    if [ -f "requirements.txt" ]; then
        pip3 install -r requirements.txt
        log_success "Python依赖安装完成"
    else
        log_warning "未找到requirements.txt文件"
    fi
}

# 配置环境变量
setup_environment() {
    log_info "配置环境变量..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_warning "已创建.env文件，请根据实际情况修改配置"
        else
            log_error "未找到.env.example文件"
            exit 1
        fi
    else
        log_info ".env文件已存在"
    fi
}

# 构建Docker镜像
build_docker_images() {
    log_info "构建Docker镜像..."
    
    # 构建API Gateway镜像
    if [ -f "Dockerfile.api" ]; then
        docker build -f Dockerfile.api -t aurora-api-gateway .
        log_success "API Gateway镜像构建完成"
    fi
    
    # 构建Emotion Service镜像
    if [ -f "Dockerfile.emotion" ]; then
        docker build -f Dockerfile.emotion -t aurora-emotion-service .
        log_success "Emotion Service镜像构建完成"
    fi
    
    # 构建Chat Service镜像
    if [ -f "Dockerfile.chat" ]; then
        docker build -f Dockerfile.chat -t aurora-chat-service .
        log_success "Chat Service镜像构建完成"
    fi
}

# 启动数据库服务
start_databases() {
    log_info "启动数据库服务..."
    
    # 启动PostgreSQL
    docker-compose up -d postgres
    log_info "等待PostgreSQL启动..."
    sleep 10
    
    # 启动Redis
    docker-compose up -d redis
    log_info "等待Redis启动..."
    sleep 5
    
    # 启动MongoDB
    docker-compose up -d mongodb
    log_info "等待MongoDB启动..."
    sleep 5
    
    log_success "数据库服务启动完成"
}

# 初始化数据库
init_database() {
    log_info "初始化数据库..."
    
    # 等待数据库完全启动
    sleep 15
    
    # 执行数据库初始化脚本
    if [ -f "sql/init.sql" ]; then
        docker exec -i aurora-postgres psql -U aurora_user -d aurora_db < sql/init.sql
        log_success "数据库初始化完成"
    else
        log_warning "未找到数据库初始化脚本"
    fi
}

# 启动应用服务
start_services() {
    log_info "启动应用服务..."
    
    # 启动所有服务
    docker-compose up -d
    
    log_success "应用服务启动完成"
}

# 检查服务状态
check_services() {
    log_info "检查服务状态..."
    
    # 等待服务启动
    sleep 30
    
    # 检查API Gateway
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "API Gateway服务正常"
    else
        log_error "API Gateway服务异常"
    fi
    
    # 检查Emotion Service
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        log_success "Emotion Service服务正常"
    else
        log_error "Emotion Service服务异常"
    fi
    
    # 检查Chat Service
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log_success "Chat Service服务正常"
    else
        log_error "Chat Service服务异常"
    fi
}

# 显示部署信息
show_deployment_info() {
    log_success "🎉 Aurora后端部署完成！"
    echo ""
    echo "服务访问地址："
    echo "  📡 API Gateway: http://localhost:3000"
    echo "  🧠 Emotion Service: http://localhost:8000"
    echo "  💬 Chat Service: http://localhost:3001"
    echo "  📚 API文档: http://localhost:3000/api-docs"
    echo "  🔍 健康检查: http://localhost:3000/health"
    echo ""
    echo "监控服务："
    echo "  📊 Prometheus: http://localhost:9090"
    echo "  📈 Grafana: http://localhost:3001"
    echo ""
    echo "数据库："
    echo "  🐘 PostgreSQL: localhost:5432"
    echo "  🔴 Redis: localhost:6379"
    echo "  🍃 MongoDB: localhost:27017"
    echo ""
    echo "管理命令："
    echo "  查看日志: docker-compose logs -f"
    echo "  停止服务: docker-compose down"
    echo "  重启服务: docker-compose restart"
    echo "  查看状态: docker-compose ps"
    echo ""
    log_warning "请确保修改.env文件中的敏感配置信息！"
}

# 主函数
main() {
    log_info "🚀 开始部署Aurora后端服务..."
    
    # 检查环境
    check_environment
    
    # 创建目录
    create_directories
    
    # 安装依赖
    install_node_dependencies
    install_python_dependencies
    
    # 配置环境
    setup_environment
    
    # 构建镜像
    build_docker_images
    
    # 启动数据库
    start_databases
    
    # 初始化数据库
    init_database
    
    # 启动服务
    start_services
    
    # 检查服务
    check_services
    
    # 显示信息
    show_deployment_info
}

# 处理命令行参数
case "${1:-}" in
    "dev")
        log_info "开发模式部署..."
        # 开发模式：只启动数据库，应用服务本地运行
        check_environment
        create_directories
        install_node_dependencies
        install_python_dependencies
        setup_environment
        start_databases
        init_database
        log_success "开发环境准备完成！"
        echo "现在可以运行以下命令启动服务："
        echo "  npm run dev"
        echo "  python src/services/emotion-service/main.py"
        ;;
    "prod")
        log_info "生产模式部署..."
        main
        ;;
    "stop")
        log_info "停止所有服务..."
        docker-compose down
        log_success "服务已停止"
        ;;
    "restart")
        log_info "重启所有服务..."
        docker-compose restart
        log_success "服务已重启"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        docker-compose ps
        ;;
    *)
        echo "Aurora后端部署脚本"
        echo ""
        echo "用法: $0 [命令]"
        echo ""
        echo "命令:"
        echo "  dev     开发模式部署（只启动数据库）"
        echo "  prod    生产模式部署（完整部署）"
        echo "  stop    停止所有服务"
        echo "  restart 重启所有服务"
        echo "  logs    查看服务日志"
        echo "  status  查看服务状态"
        echo ""
        echo "示例:"
        echo "  $0 dev    # 开发环境部署"
        echo "  $0 prod   # 生产环境部署"
        ;;
esac
