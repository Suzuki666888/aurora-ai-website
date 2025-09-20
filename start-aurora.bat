@echo off
chcp 65001 >nul
title Aurora 本地服务器

echo 🌌 Aurora 本地服务器启动脚本
echo ==================================

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ 检测到Python，使用Python服务器
    python start-local-server.py
    goto :end
)

python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ 检测到Python3，使用Python服务器
    python3 start-local-server.py
    goto :end
)

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ 检测到Node.js，使用Node.js服务器
    
    REM 检查package.json是否存在
    if not exist "package.json" (
        echo 📦 创建package.json...
        (
            echo {
            echo   "name": "aurora-local-server",
            echo   "version": "1.0.0",
            echo   "description": "Aurora本地服务器",
            echo   "main": "server.js",
            echo   "scripts": {
            echo     "start": "node server.js"
            echo   },
            echo   "dependencies": {
            echo     "express": "^4.18.2"
            echo   }
            echo }
        ) > package.json
    )
    
    REM 检查node_modules是否存在
    if not exist "node_modules" (
        echo 📦 安装依赖...
        npm install express
    )
    
    node server.js
    goto :end
)

echo ❌ 未检测到Python或Node.js
echo 请安装以下任一环境：
echo 1. Python 3.6+ (推荐)
echo 2. Node.js 14+
echo.
echo 安装Python: https://www.python.org/downloads/
echo 安装Node.js: https://nodejs.org/
echo.
pause
exit /b 1

:end
pause
