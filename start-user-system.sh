#!/bin/bash

# Aurora用户系统启动脚本
# 启动后端API服务和前端服务器

echo "🚀 启动Aurora用户系统..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm未安装，请先安装npm"
    exit 1
fi

# 进入后端目录
cd backend

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 后端package.json不存在"
    exit 1
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

# 设置环境变量
export NODE_ENV=development
export PORT=3000
export JWT_SECRET=aurora-secret-key-$(date +%s)
export JWT_EXPIRES_IN=24h
export JWT_REFRESH_EXPIRES_IN=7d
export CORS_ORIGIN=http://localhost:8080

echo "🔧 环境变量设置完成"
echo "   - NODE_ENV: $NODE_ENV"
echo "   - PORT: $PORT"
echo "   - JWT_SECRET: 已设置"
echo "   - CORS_ORIGIN: $CORS_ORIGIN"

# 启动后端API服务
echo "🌐 启动后端API服务..."
npm run start:api-only &

# 等待后端服务启动
sleep 3

# 检查后端服务是否启动成功
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ 后端API服务启动成功 (http://localhost:3000)"
else
    echo "❌ 后端API服务启动失败"
    exit 1
fi

# 返回网站根目录
cd ..

# 启动前端服务器
echo "🎨 启动前端服务器..."
python3 -m http.server 8080 &

# 等待前端服务启动
sleep 2

echo ""
echo "🎉 Aurora用户系统启动完成！"
echo ""
echo "📱 访问地址："
echo "   - 前端网站: http://localhost:8080"
echo "   - 后端API: http://localhost:3000"
echo "   - API文档: http://localhost:3000/api-docs"
echo "   - 健康检查: http://localhost:3000/health"
echo ""
echo "👤 测试账户："
echo "   - 邮箱: test@aurora.ai"
echo "   - 密码: test123"
echo ""
echo "🔧 功能说明："
echo "   - ✅ 用户注册和登录"
echo "   - ✅ 本地数据存储"
echo "   - ✅ 用户偏好设置"
echo "   - ✅ 隐私设置管理"
echo "   - ✅ 数据导出和同步"
echo "   - ✅ 情感分析记录"
echo "   - ✅ 对话会话管理"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
wait
