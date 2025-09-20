const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const router = express.Router();

// 情感分析服务URL
const EMOTION_SERVICE_URL = process.env.EMOTION_SERVICE_URL || 'http://localhost:8000';

/**
 * @swagger
 * /api/v1/emotion/analyze:
 *   post:
 *     summary: 情感分析
 *     description: 分析用户输入的情感状态
 *     tags: [Emotion]
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
 *             properties:
 *               text:
 *                 type: string
 *                 description: 要分析的文本内容
 *                 example: "我今天心情很好，工作很顺利"
 *               context:
 *                 type: object
 *                 description: 上下文信息
 *                 properties:
 *                   previousMessages:
 *                     type: array
 *                     items:
 *                       type: object
 *                   userProfile:
 *                     type: object
 *     responses:
 *       200:
 *         description: 分析成功
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
 *                     emotion:
 *                       type: string
 *                       example: "joy"
 *                     intensity:
 *                       type: number
 *                       example: 0.85
 *                     confidence:
 *                       type: number
 *                       example: 0.92
 *                     reasoning:
 *                       type: string
 *                       example: "检测到积极词汇和正面情绪表达"
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 认证失败
 *       500:
 *         description: 服务器错误
 */
router.post('/analyze', [
  body('text')
    .notEmpty()
    .withMessage('文本内容不能为空')
    .isLength({ min: 1, max: 10000 })
    .withMessage('文本长度必须在1-10000字符之间'),
  body('context')
    .optional()
    .isObject()
    .withMessage('上下文必须是对象格式'),
], async (req, res) => {
  try {
    // 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: '请求参数错误',
        details: errors.array(),
      });
    }

    const { text, context = {} } = req.body;
    const userId = req.user.id;

    logger.info(`开始情感分析: 用户${userId}`, {
      userId,
      textLength: text.length,
      hasContext: Object.keys(context).length > 0,
    });

    // 调用情感分析服务
    const response = await axios.post(`${EMOTION_SERVICE_URL}/analyze`, {
      text,
      context: {
        ...context,
        userId,
        timestamp: new Date().toISOString(),
      },
    }, {
      timeout: 10000, // 10秒超时
    });

    // 记录分析结果
    logger.info(`情感分析完成: 用户${userId}`, {
      userId,
      emotion: response.data.emotion,
      intensity: response.data.intensity,
      confidence: response.data.confidence,
    });

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    logger.error('情感分析失败:', error);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: '服务暂时不可用',
        message: '情感分析服务连接失败',
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: '情感分析失败',
        message: error.response.data.message || '分析过程中发生错误',
      });
    }

    res.status(500).json({
      success: false,
      error: '服务器错误',
      message: '情感分析过程中发生未知错误',
    });
  }
});

/**
 * @swagger
 * /api/v1/emotion/chat:
 *   post:
 *     summary: 情感对话
 *     description: 与Aurora进行情感对话
 *     tags: [Emotion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: 用户消息
 *                 example: "我今天工作压力很大"
 *               sessionId:
 *                 type: string
 *                 description: 会话ID
 *                 example: "session_123456"
 *     responses:
 *       200:
 *         description: 对话成功
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
 *                     reply:
 *                       type: string
 *                       example: "我理解你现在的压力，让我们一起面对这个问题"
 *                     emotionDetected:
 *                       type: string
 *                       example: "stress"
 *                     confidence:
 *                       type: number
 *                       example: 0.88
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 认证失败
 *       500:
 *         description: 服务器错误
 */
router.post('/chat', [
  body('message')
    .notEmpty()
    .withMessage('消息内容不能为空')
    .isLength({ min: 1, max: 5000 })
    .withMessage('消息长度必须在1-5000字符之间'),
  body('sessionId')
    .optional()
    .isString()
    .withMessage('会话ID必须是字符串'),
], async (req, res) => {
  try {
    // 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: '请求参数错误',
        details: errors.array(),
      });
    }

    const { message, sessionId } = req.body;
    const userId = req.user.id;

    logger.info(`开始情感对话: 用户${userId}`, {
      userId,
      sessionId,
      messageLength: message.length,
    });

    // 调用对话服务
    const response = await axios.post(`${EMOTION_SERVICE_URL}/chat`, {
      message,
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
    }, {
      timeout: 15000, // 15秒超时
    });

    // 记录对话结果
    logger.info(`情感对话完成: 用户${userId}`, {
      userId,
      sessionId,
      replyLength: response.data.reply ? response.data.reply.length : 0,
    });

    // 直接返回文本回复
    res.json({
      success: true,
      data: response.data.reply || response.data,
    });
  } catch (error) {
    logger.error('情感对话失败:', error);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: '服务暂时不可用',
        message: '对话服务连接失败',
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: '对话失败',
        message: error.response.data.message || '对话过程中发生错误',
      });
    }

    res.status(500).json({
      success: false,
      error: '服务器错误',
      message: '对话过程中发生未知错误',
    });
  }
});

/**
 * @swagger
 * /api/v1/emotion/status:
 *   get:
 *     summary: 获取情感状态
 *     description: 获取用户当前的情感状态
 *     tags: [Emotion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [hour, day, week, month]
 *         description: 时间范围
 *         example: "day"
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
 *                     currentEmotion:
 *                       type: string
 *                       example: "calm"
 *                     emotionHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                     averageIntensity:
 *                       type: number
 *                       example: 0.65
 *       401:
 *         description: 认证失败
 *       500:
 *         description: 服务器错误
 */
router.get('/status', async (req, res) => {
  try {
    const userId = req.user.id;
    const timeframe = req.query.timeframe || 'day';

    logger.info(`获取情感状态: 用户${userId}`, {
      userId,
      timeframe,
    });

    // 调用情感状态服务
    const response = await axios.get(`${EMOTION_SERVICE_URL}/status`, {
      params: {
        userId,
        timeframe,
      },
      timeout: 5000,
    });

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    logger.error('获取情感状态失败:', error);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: '服务暂时不可用',
        message: '情感状态服务连接失败',
      });
    }

    res.status(500).json({
      success: false,
      error: '服务器错误',
      message: '获取情感状态时发生错误',
    });
  }
});

/**
 * @swagger
 * /api/v1/emotion/navigate:
 *   post:
 *     summary: 情感导航
 *     description: 获取情感导航建议
 *     tags: [Emotion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentEmotion
 *               - targetEmotion
 *             properties:
 *               currentEmotion:
 *                 type: string
 *                 description: 当前情感状态
 *                 example: "anxiety"
 *               targetEmotion:
 *                 type: string
 *                 description: 目标情感状态
 *                 example: "calm"
 *               preferences:
 *                 type: object
 *                 description: 用户偏好
 *     responses:
 *       200:
 *         description: 导航成功
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
 *                     path:
 *                       type: array
 *                       items:
 *                         type: object
 *                     estimatedTime:
 *                       type: number
 *                       example: 15
 *                     difficulty:
 *                       type: string
 *                       example: "medium"
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 认证失败
 *       500:
 *         description: 服务器错误
 */
router.post('/navigate', [
  body('currentEmotion')
    .notEmpty()
    .withMessage('当前情感状态不能为空'),
  body('targetEmotion')
    .notEmpty()
    .withMessage('目标情感状态不能为空'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('偏好设置必须是对象格式'),
], async (req, res) => {
  try {
    // 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: '请求参数错误',
        details: errors.array(),
      });
    }

    const { currentEmotion, targetEmotion, preferences = {} } = req.body;
    const userId = req.user.id;

    logger.info(`开始情感导航: 用户${userId}`, {
      userId,
      currentEmotion,
      targetEmotion,
      hasPreferences: Object.keys(preferences).length > 0,
    });

    // 调用情感导航服务
    const response = await axios.post(`${EMOTION_SERVICE_URL}/navigate`, {
      currentEmotion,
      targetEmotion,
      preferences: {
        ...preferences,
        userId,
      },
    }, {
      timeout: 10000,
    });

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    logger.error('情感导航失败:', error);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: '服务暂时不可用',
        message: '情感导航服务连接失败',
      });
    }

    res.status(500).json({
      success: false,
      error: '服务器错误',
      message: '情感导航过程中发生错误',
    });
  }
});

module.exports = router;
