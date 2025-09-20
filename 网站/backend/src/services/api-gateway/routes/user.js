const express = require('express');
const { body, validationResult } = require('express-validator');
const UserService = require('../../user-service/userService');
const logger = require('../utils/logger');

const router = express.Router();
const userService = new UserService();

/**
 * @swagger
 * /api/v1/user/data:
 *   get:
 *     summary: 获取用户数据
 *     description: 获取当前用户的所有本地数据
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
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
 *                     emotionHistory:
 *                       type: array
 *                     chatSessions:
 *                       type: array
 *                     preferences:
 *                       type: object
 *                     privacySettings:
 *                       type: object
 *                     lastSync:
 *                       type: string
 *       401:
 *         description: 未认证
 *       404:
 *         description: 用户数据不存在
 */
router.get('/data', async (req, res) => {
    try {
        const userId = req.user.id;
        const userData = userService.getUserData(userId);

        res.json({
            success: true,
            data: userData
        });

    } catch (error) {
        logger.error('获取用户数据失败:', error);
        res.status(404).json({
            success: false,
            error: '用户数据不存在',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/v1/user/data:
 *   post:
 *     summary: 保存用户数据
 *     description: 保存用户数据到本地存储
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: object
 *               privacySettings:
 *                 type: object
 *               customData:
 *                 type: object
 *     responses:
 *       200:
 *         description: 保存成功
 *       401:
 *         description: 未认证
 *       400:
 *         description: 请求参数错误
 */
router.post('/data', [
    body('preferences').optional().isObject().withMessage('偏好设置必须是对象'),
    body('privacySettings').optional().isObject().withMessage('隐私设置必须是对象'),
    body('customData').optional().isObject().withMessage('自定义数据必须是对象')
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

        const userId = req.user.id;
        const data = req.body;
        
        const result = await userService.saveUserData(userId, data);

        res.json(result);

    } catch (error) {
        logger.error('保存用户数据失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/v1/user/emotion:
 *   post:
 *     summary: 添加情感分析记录
 *     description: 添加用户的情感分析记录到本地存储
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - emotion
 *               - intensity
 *               - confidence
 *             properties:
 *               text:
 *                 type: string
 *                 example: "我今天很开心"
 *               emotion:
 *                 type: string
 *                 example: "joy"
 *               intensity:
 *                 type: number
 *                 example: 0.8
 *               confidence:
 *                 type: number
 *                 example: 0.9
 *               reasoning:
 *                 type: string
 *               secondaryEmotions:
 *                 type: array
 *               contextData:
 *                 type: object
 *     responses:
 *       200:
 *         description: 添加成功
 *       401:
 *         description: 未认证
 *       400:
 *         description: 请求参数错误
 */
router.post('/emotion', [
    body('text').notEmpty().withMessage('文本内容不能为空'),
    body('emotion').notEmpty().withMessage('情感类型不能为空'),
    body('intensity').isFloat({ min: 0, max: 1 }).withMessage('情感强度必须在0-1之间'),
    body('confidence').isFloat({ min: 0, max: 1 }).withMessage('置信度必须在0-1之间'),
    body('reasoning').optional().isString(),
    body('secondaryEmotions').optional().isArray(),
    body('contextData').optional().isObject()
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

        const userId = req.user.id;
        const emotionData = req.body;
        
        const result = await userService.addEmotionRecord(userId, emotionData);

        res.json(result);

    } catch (error) {
        logger.error('添加情感记录失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/v1/user/chat:
 *   post:
 *     summary: 添加对话会话
 *     description: 添加用户的对话会话到本地存储
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - messages
 *             properties:
 *               title:
 *                 type: string
 *                 example: "关于工作的讨论"
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, aurora]
 *                     content:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *               emotionSummary:
 *                 type: object
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: 添加成功
 *       401:
 *         description: 未认证
 *       400:
 *         description: 请求参数错误
 */
router.post('/chat', [
    body('title').notEmpty().withMessage('会话标题不能为空'),
    body('messages').isArray().withMessage('消息必须是数组'),
    body('emotionSummary').optional().isObject(),
    body('duration').optional().isNumeric()
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

        const userId = req.user.id;
        const sessionData = req.body;
        
        const result = await userService.addChatSession(userId, sessionData);

        res.json(result);

    } catch (error) {
        logger.error('添加对话会话失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/v1/user/preferences:
 *   put:
 *     summary: 更新用户偏好设置
 *     description: 更新用户的偏好设置
 *     tags: [User Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [dark, light, auto]
 *               language:
 *                 type: string
 *                 enum: [zh-CN, en-US]
 *               notifications:
 *                 type: boolean
 *               privacy:
 *                 type: string
 *                 enum: [standard, strict, relaxed]
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         description: 未认证
 *       400:
 *         description: 请求参数错误
 */
router.put('/preferences', [
    body('theme').optional().isIn(['dark', 'light', 'auto']).withMessage('主题必须是dark、light或auto'),
    body('language').optional().isIn(['zh-CN', 'en-US']).withMessage('语言必须是zh-CN或en-US'),
    body('notifications').optional().isBoolean().withMessage('通知设置必须是布尔值'),
    body('privacy').optional().isIn(['standard', 'strict', 'relaxed']).withMessage('隐私级别必须是standard、strict或relaxed')
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

        const userId = req.user.id;
        const preferences = req.body;
        
        const result = await userService.updateUserPreferences(userId, preferences);

        res.json(result);

    } catch (error) {
        logger.error('更新用户偏好设置失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/v1/user/privacy:
 *   put:
 *     summary: 更新用户隐私设置
 *     description: 更新用户的隐私设置
 *     tags: [User Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataSharing:
 *                 type: boolean
 *               analytics:
 *                 type: boolean
 *               personalizedAds:
 *                 type: boolean
 *               dataRetention:
 *                 type: string
 *                 enum: [30, 90, 365, never]
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         description: 未认证
 *       400:
 *         description: 请求参数错误
 */
router.put('/privacy', [
    body('dataSharing').optional().isBoolean().withMessage('数据共享设置必须是布尔值'),
    body('analytics').optional().isBoolean().withMessage('分析设置必须是布尔值'),
    body('personalizedAds').optional().isBoolean().withMessage('个性化广告设置必须是布尔值'),
    body('dataRetention').optional().isIn(['30', '90', '365', 'never']).withMessage('数据保留期必须是30、90、365或never')
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

        const userId = req.user.id;
        const privacySettings = req.body;
        
        const result = await userService.updateUserPrivacySettings(userId, privacySettings);

        res.json(result);

    } catch (error) {
        logger.error('更新用户隐私设置失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/v1/user/stats:
 *   get:
 *     summary: 获取用户统计信息
 *     description: 获取用户的使用统计信息
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
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
 *                     emotionCount:
 *                       type: number
 *                     chatCount:
 *                       type: number
 *                     lastEmotion:
 *                       type: object
 *                     lastChat:
 *                       type: object
 *                     lastSync:
 *                       type: string
 *       401:
 *         description: 未认证
 *       404:
 *         description: 用户数据不存在
 */
router.get('/stats', async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = userService.getUserStats(userId);

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        logger.error('获取用户统计信息失败:', error);
        res.status(404).json({
            success: false,
            error: '用户数据不存在',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/v1/user/export:
 *   get:
 *     summary: 导出用户数据
 *     description: 导出用户的所有数据（用于数据迁移或备份）
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 导出成功
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
 *                     data:
 *                       type: object
 *                     exportDate:
 *                       type: string
 *                     version:
 *                       type: string
 *       401:
 *         description: 未认证
 *       404:
 *         description: 用户数据不存在
 */
router.get('/export', async (req, res) => {
    try {
        const userId = req.user.id;
        const exportData = userService.exportUserData(userId);

        res.json({
            success: true,
            data: exportData
        });

    } catch (error) {
        logger.error('导出用户数据失败:', error);
        res.status(404).json({
            success: false,
            error: '用户数据不存在',
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/v1/user/delete:
 *   delete:
 *     summary: 删除用户数据
 *     description: 删除用户的所有数据（不可恢复）
 *     tags: [User Data]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 删除成功
 *       401:
 *         description: 未认证
 *       500:
 *         description: 服务器错误
 */
router.delete('/delete', async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await userService.deleteUserData(userId);

        res.json(result);

    } catch (error) {
        logger.error('删除用户数据失败:', error);
        res.status(500).json({
            success: false,
            error: '服务器错误',
            message: error.message
        });
    }
});

module.exports = router;
