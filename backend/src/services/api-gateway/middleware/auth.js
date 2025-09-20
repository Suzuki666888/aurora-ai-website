const jwt = require('jsonwebtoken');
const { User } = require('../../models/User');
const logger = require('../utils/logger');

/**
 * JWT认证中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: '认证失败',
        message: '缺少有效的认证令牌',
        code: 'MISSING_TOKEN',
      });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 检查用户是否存在
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: '认证失败',
        message: '用户不存在',
        code: 'USER_NOT_FOUND',
      });
    }

    // 检查用户状态
    if (!user.isActive) {
      return res.status(401).json({
        error: '认证失败',
        message: '用户账户已被禁用',
        code: 'USER_DISABLED',
      });
    }

    // 将用户信息添加到请求对象
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      preferences: user.preferences,
    };

    // 记录认证成功
    logger.info(`用户认证成功: ${user.email}`, {
      userId: user.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    next();
  } catch (error) {
    logger.error('认证中间件错误:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: '认证失败',
        message: '无效的认证令牌',
        code: 'INVALID_TOKEN',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: '认证失败',
        message: '认证令牌已过期',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(500).json({
      error: '服务器错误',
      message: '认证过程中发生错误',
      code: 'AUTH_ERROR',
    });
  }
};

/**
 * 角色权限检查中间件
 * @param {Array} roles - 允许的角色数组
 * @returns {Function} 中间件函数
 */
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: '认证失败',
        message: '用户未认证',
        code: 'NOT_AUTHENTICATED',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`权限不足: ${req.user.email} 尝试访问需要 ${roles.join(', ')} 角色的资源`, {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        ip: req.ip,
      });

      return res.status(403).json({
        error: '权限不足',
        message: `需要 ${roles.join(' 或 ')} 角色权限`,
        code: 'INSUFFICIENT_PERMISSIONS',
      });
    }

    next();
  };
};

/**
 * 可选认证中间件（不强制要求认证）
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 没有token，继续执行但不设置用户信息
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (user && user.isActive) {
      req.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        preferences: user.preferences,
      };
    }

    next();
  } catch (error) {
    // 可选认证失败时不返回错误，继续执行
    logger.warn('可选认证失败:', error.message);
    next();
  }
};

/**
 * 生成JWT令牌
 * @param {Object} user - 用户对象
 * @param {string} expiresIn - 过期时间
 * @returns {string} JWT令牌
 */
const generateToken = (user, expiresIn = process.env.JWT_EXPIRES_IN || '24h') => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
    issuer: 'aurora-api',
    audience: 'aurora-client',
  });
};

/**
 * 生成刷新令牌
 * @param {Object} user - 用户对象
 * @returns {string} 刷新令牌
 */
const generateRefreshToken = (user) => {
  const payload = {
    userId: user.id,
    type: 'refresh',
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: 'aurora-api',
    audience: 'aurora-client',
  });
};

/**
 * 验证刷新令牌
 * @param {string} token - 刷新令牌
 * @returns {Object} 解码后的令牌信息
 */
const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  if (decoded.type !== 'refresh') {
    throw new Error('无效的刷新令牌');
  }
  
  return decoded;
};

module.exports = {
  authMiddleware,
  roleMiddleware,
  optionalAuthMiddleware,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
};
