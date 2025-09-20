#!/bin/bash

echo "🌌 Aurora AI 对话调试工具"
echo "=========================="
echo ""

# 检查Python是否可用
if command -v python3 &> /dev/null; then
    echo "✅ Python3 已安装"
    python3 start-debug-server.py
elif command -v python &> /dev/null; then
    echo "✅ Python 已安装"
    python start-debug-server.py
else
    echo "❌ 未找到Python，请安装Python后重试"
    echo ""
    echo "或者手动启动服务器："
    echo "1. 打开终端"
    echo "2. 进入网站目录"
    echo "3. 运行: python3 -m http.server 8000"
    echo "4. 访问: http://localhost:8000/dialogue.html"
    exit 1
fi
