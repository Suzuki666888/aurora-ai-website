#!/bin/bash

# Aurora 本地服务器启动脚本
# 让用户在自己的网络环境中运行Aurora

echo "🌌 Aurora 本地服务器启动脚本"
echo "=================================="

# 检查Python是否安装
if command -v python3 &> /dev/null; then
    echo "✅ 检测到Python3，使用Python服务器"
    python3 start-local-server.py
elif command -v python &> /dev/null; then
    echo "✅ 检测到Python，使用Python服务器"
    python start-local-server.py
elif command -v node &> /dev/null; then
    echo "✅ 检测到Node.js，使用Node.js服务器"
    if [ ! -f "package.json" ]; then
        echo "📦 创建package.json..."
        cat > package.json << EOF
{
  "name": "aurora-local-server",
  "version": "1.0.0",
  "description": "Aurora本地服务器",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF
    fi
    
    if [ ! -d "node_modules" ]; then
        echo "📦 安装依赖..."
        npm install express
    fi
    
    node server.js
else
    echo "❌ 未检测到Python或Node.js"
    echo "请安装以下任一环境："
    echo "1. Python 3.6+ (推荐)"
    echo "2. Node.js 14+"
    echo ""
    echo "安装Python: https://www.python.org/downloads/"
    echo "安装Node.js: https://nodejs.org/"
    exit 1
fi
