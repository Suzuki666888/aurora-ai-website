const logger = require('../utils/logger');

/**
 * 全局错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const errorHandler = (err, req, res, next) => {
    // 记录错误日志
    logger.error('API错误:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id
    });

    // 默认错误响应
    let statusCode = 500;
    let message = '服务器内部错误';
    let code = 'INTERNAL_ERROR';

    // 根据错误类型设置状态码和消息
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = '请求参数验证失败';
        code = 'VALIDATION_ERROR';
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = '认证失败';
        code = 'UNAUTHORIZED';
    } else if (err.name === 'ForbiddenError') {
        statusCode = 403;
        message = '权限不足';
        code = 'FORBIDDEN';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        message = '资源不存在';
        code = 'NOT_FOUND';
    } else if (err.name === 'ConflictError') {
        statusCode = 409;
        message = '资源冲突';
        code = 'CONFLICT';
    } else if (err.name === 'RateLimitError') {
        statusCode = 429;
        message = '请求过于频繁';
        code = 'RATE_LIMIT';
    }

    // 发送错误响应
    res.status(statusCode).json({
        success: false,
        error: message,
        code: code,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method
    });
};

module.exports = { errorHandler };
