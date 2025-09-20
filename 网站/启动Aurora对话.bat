@echo off
echo 🌌 启动Aurora AI对话系统...
echo ================================

cd /d "%~dp0"
echo 📁 当前目录: %CD%

echo 🚀 启动HTTP服务器...
start http://localhost:8000/dialogue.html
python3 -m http.server 8000

pause
