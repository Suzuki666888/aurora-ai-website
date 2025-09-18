#!/bin/bash

# Aurora项目环境设置脚本
# 用于安装Node.js和启动后端服务

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
        return 1
    fi
    return 0
}

# 检查Node.js是否已安装
check_nodejs() {
    if check_command "node" && check_command "npm"; then
        NODE_VERSION=$(node --version)
        NPM_VERSION=$(npm --version)
        log_success "Node.js已安装: $NODE_VERSION"
        log_success "npm已安装: $NPM_VERSION"
        return 0
    else
        return 1
    fi
}

# 安装Node.js
install_nodejs() {
    log_info "开始安装Node.js..."
    
    # 检查是否有Homebrew
    if check_command "brew"; then
        log_info "使用Homebrew安装Node.js..."
        brew install node
    else
        log_warning "未找到Homebrew，请手动安装Node.js"
        log_info "请访问 https://nodejs.org/ 下载并安装Node.js"
        log_info "或者安装Homebrew后重新运行此脚本:"
        log_info "/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
}

# 设置项目环境
setup_project() {
    log_info "设置项目环境..."
    
    # 检查当前目录
    if [ ! -d "backend" ]; then
        log_error "未找到backend目录，请确保在正确的项目目录中运行此脚本"
        log_info "当前目录: $(pwd)"
        log_info "请运行: cd /Users/qiushuaiboqiushuaibo/Desktop/Aurora/网站"
        exit 1
    fi
    
    # 进入backend目录
    cd backend
    
    # 安装依赖
    log_info "安装项目依赖..."
    npm install
    
    log_success "项目环境设置完成"
}

# 启动服务
start_services() {
    log_info "启动Aurora API服务..."
    
    # 检查是否在backend目录
    if [ ! -f "package.json" ]; then
        log_error "未找到package.json，请确保在backend目录中"
        exit 1
    fi
    
    log_success "🚀 启动Aurora API服务..."
    log_info "服务地址: http://localhost:3000"
    log_info "健康检查: http://localhost:3000/health"
    log_info ""
    log_info "📋 测试账户信息:"
    log_info "   邮箱: test@aurora.ai"
    log_info "   密码: test123"
    log_info ""
    log_info "🧪 测试命令:"
    log_info "   新终端运行: npm run test:auth"
    log_info ""
    log_info "按 Ctrl+C 停止服务"
    log_info ""
    
    # 启动服务
    npm run start:api-only
}

# 主函数
main() {
    log_info "🚀 Aurora项目环境设置开始..."
    
    # 检查Node.js
    if ! check_nodejs; then
        log_warning "Node.js未安装，开始安装..."
        install_nodejs
        
        # 重新检查
        if ! check_nodejs; then
            log_error "Node.js安装失败，请手动安装"
            exit 1
        fi
    fi
    
    # 设置项目环境
    setup_project
    
    # 启动服务
    start_services
}

# 处理命令行参数
case "${1:-}" in
    "install")
        log_info "只安装Node.js..."
        if ! check_nodejs; then
            install_nodejs
        else
            log_success "Node.js已安装"
        fi
        ;;
    "setup")
        log_info "只设置项目环境..."
        setup_project
        ;;
    "start")
        log_info "只启动服务..."
        start_services
        ;;
    "check")
        log_info "检查环境..."
        if check_nodejs; then
            log_success "Node.js环境正常"
        else
            log_error "Node.js环境异常"
        fi
        
        if [ -d "backend" ]; then
            log_success "项目目录正常"
        else
            log_error "项目目录异常"
        fi
        ;;
    *)
        main
        ;;
esac
