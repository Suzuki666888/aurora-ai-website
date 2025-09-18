const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const router = express.Router();

// 模拟用户数据库（实际项目中应该使用真实数据库）
let users = [
    {
        id: 'test-user-1',
        email: 'test@aurora.ai',
        username: 'testuser',
        password: '$2a$12$DVOrG9J7WAtnqhOrbhJWM.cUvPbZeHEjLq0K5Plv9.GzZoH8pSEHy', // test123
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        isActive: true,
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLogin: null
    }
];

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: 用户注册
 *     description: 注册新的用户账户
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "username"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *     responses:
 *       201:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     message:
 *                       type: string
 *       400:
 *         description: 请求参数错误
 *       409:
 *         description: 用户已存在
 */
router.post('/register', [
    body('email')
        .isEmail()
        .withMessage('请输入有效的邮箱地址')
        .normalizeEmail(),
    body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('用户名长度必须在3-20字符之间')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('用户名只能包含字母、数字和下划线'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('密码长度至少6位'),
    body('firstName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('名字长度必须在1-50字符之间'),
    body('lastName')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('姓氏长度必须在1-50字符之间')
], async (req, res) => {
    try {
        // 验证请求参数
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: '请求参数错误',
                details: errors.array()
            });
        }

        const { email, username, password, firstName, lastName } = req.body;

        // 检查用户是否已存在
        const existingUser = users.find(u => u.email === email || u.username === username);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: '用户已存在',
                message: existingUser.email === email ? '邮箱已被注册' : '用户名已被使用'
            });
        }

        // 加密密码
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 创建新用户
        const newUser = {
            id: uuidv4(),
            email,
            username,
            password: passwordHash,
            firstName: firstName || '',
            lastName: lastName || '',
            role: 'user',
            isActive: true,
            isVerified: false,
            preferences: {},
            privacySettings: {},
            createdAt: new Date().toISOString(),
            lastLogin: null,
            loginCount: 0
        };

        users.push(newUser);

        logger.info('用户注册成功', { userId: newUser.id, email: newUser.email });

        // 返回用户信息（不包含密码）
        const { password: _, ...userResponse } = newUser;

        res.status(201).json({
            success: true,
            data: {
                user: userResponse,
                message: '注册成功'
            }
        });

    } catch (error) {
        logger.error('用户注册失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: '注册过程中发生错误'
        });
    }
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: 用户登录
 *     description: 用户登录获取访问令牌
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                   data:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                       tokens:
 *                         type: object
 *                         properties:
 *                           accessToken:
 *                             type: string
 *                           refreshToken:
 *                             type: string
 *                           expiresIn:
 *                             type: string
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 认证失败
 */
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('请输入有效的邮箱地址')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('密码不能为空')
], async (req, res) => {
    try {
        // 验证请求参数
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: '请求参数错误',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // 查找用户
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '认证失败',
                message: '邮箱或密码错误'
            });
        }

        // 检查用户状态
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: '账户被禁用',
                message: '您的账户已被禁用，请联系管理员'
            });
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: '认证失败',
                message: '邮箱或密码错误'
            });
        }

        // 生成JWT令牌
        const accessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'aurora-secret-key',
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h',
                issuer: 'aurora-api',
                audience: 'aurora-client'
            }
        );

        const refreshToken = jwt.sign(
            {
                userId: user.id,
                type: 'refresh'
            },
            process.env.JWT_SECRET || 'aurora-secret-key',
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
                issuer: 'aurora-api',
                audience: 'aurora-client'
            }
        );

        // 更新用户登录信息
        user.lastLogin = new Date().toISOString();
        user.loginCount = (user.loginCount || 0) + 1;

        logger.info('用户登录成功', { 
            userId: user.id, 
            email: user.email,
            ip: req.ip 
        });

        // 返回用户信息和令牌
        const { password: _, ...userResponse } = user;

        res.json({
            success: true,
            data: {
                user: userResponse,
                tokens: {
                    accessToken,
                    refreshToken,
                    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
                }
            }
        });

    } catch (error) {
        logger.error('用户登录失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: '登录过程中发生错误'
        });
    }
});

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: 刷新访问令牌
 *     description: 使用刷新令牌获取新的访问令牌
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "refresh_token_here"
 *     responses:
 *       200:
 *         description: 令牌刷新成功
 *       401:
 *         description: 刷新令牌无效
 */
router.post('/refresh', [
    body('refreshToken')
        .notEmpty()
        .withMessage('刷新令牌不能为空')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: '请求参数错误',
                details: errors.array()
            });
        }

        const { refreshToken } = req.body;

        // 验证刷新令牌
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'aurora-secret-key');
        
        if (decoded.type !== 'refresh') {
            return res.status(401).json({
                success: false,
                error: '无效的刷新令牌',
                message: '令牌类型错误'
            });
        }

        // 查找用户
        const user = users.find(u => u.id === decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: '用户不存在或已被禁用',
                message: '无法刷新令牌'
            });
        }

        // 生成新的访问令牌
        const newAccessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'aurora-secret-key',
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '24h',
                issuer: 'aurora-api',
                audience: 'aurora-client'
            }
        );

        logger.info('令牌刷新成功', { userId: user.id });

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                expiresIn: process.env.JWT_EXPIRES_IN || '24h'
            }
        });

    } catch (error) {
        logger.error('令牌刷新失败:', error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: '无效的刷新令牌',
                message: '令牌已过期或无效'
            });
        }

        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: '令牌刷新过程中发生错误'
        });
    }
});

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: 用户登出
 *     description: 用户登出（客户端需要清除本地存储的令牌）
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 登出成功
 *       401:
 *         description: 未认证
 */
router.post('/logout', async (req, res) => {
    try {
        // 这里可以添加令牌黑名单逻辑
        // 目前只是返回成功，客户端需要清除本地存储的令牌
        
        logger.info('用户登出', { 
            userId: req.user?.id,
            ip: req.ip 
        });

        res.json({
            success: true,
            message: '登出成功'
        });

    } catch (error) {
        logger.error('用户登出失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: '登出过程中发生错误'
        });
    }
});

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: 获取当前用户信息
 *     description: 获取当前登录用户的信息
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未认证
 */
router.get('/me', async (req, res) => {
    try {
        const user = users.find(u => u.id === req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: '用户不存在',
                message: '无法找到用户信息'
            });
        }

        const { password: _, ...userResponse } = user;

        res.json({
            success: true,
            data: {
                user: userResponse
            }
        });

    } catch (error) {
        logger.error('获取用户信息失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: '获取用户信息时发生错误'
        });
    }
});

module.exports = router;
