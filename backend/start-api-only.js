#!/usr/bin/env node

/**
 * 只启动API Gateway服务
 * 用于快速测试认证功能
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./src/services/api-gateway/routes/auth');
const { errorHandler } = require('./src/services/api-gateway/middleware/errorHandler');
const logger = require('./src/services/api-gateway/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: '*', // 开发环境允许所有来源
    credentials: true,
}));

// 限流配置
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 100次请求
    message: {
        error: '请求过于频繁，请稍后再试',
        retryAfter: 900,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// 日志中间件
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()),
    },
}));

// 解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'aurora-api-gateway',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
    });
});

// API路由
app.use('/api/v1/auth', authRoutes);

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        error: '接口不存在',
        message: `无法找到 ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString(),
    });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
    logger.info(`🚀 Aurora API Gateway 启动成功`);
    logger.info(`📡 服务地址: http://localhost:${PORT}`);
    logger.info(`🔍 健康检查: http://localhost:${PORT}/health`);
    logger.info(`🔐 认证接口: http://localhost:${PORT}/api/v1/auth`);
    logger.info(`\n📋 可用的测试账户:`);
    logger.info(`   邮箱: test@aurora.ai`);
    logger.info(`   密码: test123`);
    logger.info(`\n🧪 运行测试: node test-auth.js`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    logger.info('收到SIGTERM信号，开始优雅关闭...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('收到SIGINT信号，开始优雅关闭...');
    process.exit(0);
});

module.exports = app;
