const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const emotionRoutes = require('./routes/emotion');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');
const { validateRequest } = require('./middleware/validation');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aurora API',
      version: '1.0.0',
      description: 'Aurora情感AI后端API文档',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '开发环境',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/services/api-gateway/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 中间件配置
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// 限流配置
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15分钟
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // 限制每个IP 100次请求
  message: {
    error: '请求过于频繁，请稍后再试',
    retryAfter: Math.ceil((process.env.RATE_LIMIT_WINDOW || 15) * 60),
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

// API文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API路由
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/emotion', authMiddleware, emotionRoutes);
app.use('/api/v1/chat', authMiddleware, chatRoutes);
app.use('/api/v1/user', authMiddleware, userRoutes);

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
  logger.info(`📚 API文档: http://localhost:${PORT}/api-docs`);
  logger.info(`🔍 健康检查: http://localhost:${PORT}/health`);
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
