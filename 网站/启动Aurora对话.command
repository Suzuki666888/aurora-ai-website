#!/bin/bash

echo "🌌 启动Aurora AI对话系统..."
echo "================================"

# 切换到脚本所在目录
cd "$(dirname "$0")"
echo "📁 当前目录: $(pwd)"

echo "🚀 启动HTTP服务器..."
echo "💬 对话页面: http://localhost:8000/dialogue.html"
echo "🔧 调试页面: http://localhost:8000/debug-dialogue.html"
echo ""

# 自动打开浏览器
open http://localhost:8000/dialogue.html

# 启动服务器
python3 -m http.server 8000
