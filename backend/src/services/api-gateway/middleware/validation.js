const { validationResult } = require('express-validator');

/**
 * 请求验证中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: '请求参数验证失败',
            details: errors.array()
        });
    }
    
    next();
};

module.exports = { validateRequest };
