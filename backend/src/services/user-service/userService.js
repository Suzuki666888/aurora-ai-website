/**
 * Aurora用户服务
 * 处理用户数据管理、本地存储、数据同步等功能
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

class UserService {
    constructor() {
        // 模拟数据库（实际项目中应该使用真实数据库）
        this.users = new Map();
        this.userSessions = new Map();
        this.userData = new Map(); // 用户本地数据存储
        
        // 初始化测试用户
        this.initializeTestUsers();
    }

    /**
     * 初始化测试用户
     */
    initializeTestUsers() {
        const testUsers = [
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
                preferences: {
                    theme: 'dark',
                    language: 'zh-CN',
                    notifications: true,
                    privacy: 'standard'
                },
                privacySettings: {
                    dataSharing: false,
                    analytics: true,
                    personalizedAds: false
                },
                createdAt: new Date().toISOString(),
                lastLogin: null,
                loginCount: 0
            }
        ];

        testUsers.forEach(user => {
            this.users.set(user.id, user);
            // 初始化用户数据存储
            this.userData.set(user.id, {
                emotionHistory: [],
                chatSessions: [],
                preferences: user.preferences,
                privacySettings: user.privacySettings,
                lastSync: new Date().toISOString()
            });
        });

        logger.info('测试用户初始化完成');
    }

    /**
     * 用户注册
     * @param {Object} userData - 用户注册数据
     * @returns {Promise<Object>} 注册结果
     */
    async registerUser(userData) {
        try {
            const { email, username, password, firstName, lastName } = userData;

            // 检查用户是否已存在
            const existingUser = Array.from(this.users.values()).find(
                u => u.email === email || u.username === username
            );

            if (existingUser) {
                throw new Error(existingUser.email === email ? '邮箱已被注册' : '用户名已被使用');
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
                preferences: {
                    theme: 'dark',
                    language: 'zh-CN',
                    notifications: true,
                    privacy: 'standard'
                },
                privacySettings: {
                    dataSharing: false,
                    analytics: true,
                    personalizedAds: false
                },
                createdAt: new Date().toISOString(),
                lastLogin: null,
                loginCount: 0
            };

            this.users.set(newUser.id, newUser);

            // 初始化用户数据存储
            this.userData.set(newUser.id, {
                emotionHistory: [],
                chatSessions: [],
                preferences: newUser.preferences,
                privacySettings: newUser.privacySettings,
                lastSync: new Date().toISOString()
            });

            logger.info('用户注册成功', { userId: newUser.id, email: newUser.email });

            // 返回用户信息（不包含密码）
            const { password: _, ...userResponse } = newUser;
            return {
                success: true,
                data: {
                    user: userResponse,
                    message: '注册成功'
                }
            };

        } catch (error) {
            logger.error('用户注册失败:', error);
            throw error;
        }
    }

    /**
     * 用户登录
     * @param {string} email - 用户邮箱
     * @param {string} password - 用户密码
     * @returns {Promise<Object>} 登录结果
     */
    async loginUser(email, password) {
        try {
            // 查找用户
            const user = Array.from(this.users.values()).find(u => u.email === email);
            if (!user) {
                throw new Error('邮箱或密码错误');
            }

            // 检查用户状态
            if (!user.isActive) {
                throw new Error('账户已被禁用，请联系管理员');
            }

            // 验证密码
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('邮箱或密码错误');
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

            // 创建会话记录
            const sessionId = uuidv4();
            this.userSessions.set(sessionId, {
                userId: user.id,
                accessToken,
                refreshToken,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时
            });

            logger.info('用户登录成功', { 
                userId: user.id, 
                email: user.email,
                sessionId 
            });

            // 返回用户信息和令牌
            const { password: _, ...userResponse } = user;

            return {
                success: true,
                data: {
                    user: userResponse,
                    tokens: {
                        accessToken,
                        refreshToken,
                        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
                    },
                    sessionId
                }
            };

        } catch (error) {
            logger.error('用户登录失败:', error);
            throw error;
        }
    }

    /**
     * 获取用户数据
     * @param {string} userId - 用户ID
     * @returns {Object} 用户数据
     */
    getUserData(userId) {
        const userData = this.userData.get(userId);
        if (!userData) {
            throw new Error('用户数据不存在');
        }
        return userData;
    }

    /**
     * 保存用户数据到本地存储
     * @param {string} userId - 用户ID
     * @param {Object} data - 要保存的数据
     * @returns {Promise<Object>} 保存结果
     */
    async saveUserData(userId, data) {
        try {
            const userData = this.userData.get(userId);
            if (!userData) {
                throw new Error('用户数据不存在');
            }

            // 合并数据
            const updatedData = {
                ...userData,
                ...data,
                lastSync: new Date().toISOString()
            };

            this.userData.set(userId, updatedData);

            logger.info('用户数据保存成功', { userId, dataKeys: Object.keys(data) });

            return {
                success: true,
                data: {
                    message: '数据保存成功',
                    lastSync: updatedData.lastSync
                }
            };

        } catch (error) {
            logger.error('用户数据保存失败:', error);
            throw error;
        }
    }

    /**
     * 添加情感分析记录
     * @param {string} userId - 用户ID
     * @param {Object} emotionData - 情感数据
     * @returns {Promise<Object>} 保存结果
     */
    async addEmotionRecord(userId, emotionData) {
        try {
            const userData = this.userData.get(userId);
            if (!userData) {
                throw new Error('用户数据不存在');
            }

            const emotionRecord = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                ...emotionData
            };

            userData.emotionHistory.push(emotionRecord);
            
            // 保持最近100条记录
            if (userData.emotionHistory.length > 100) {
                userData.emotionHistory = userData.emotionHistory.slice(-100);
            }

            userData.lastSync = new Date().toISOString();
            this.userData.set(userId, userData);

            logger.info('情感记录添加成功', { userId, emotionId: emotionRecord.id });

            return {
                success: true,
                data: {
                    emotionRecord,
                    message: '情感记录保存成功'
                }
            };

        } catch (error) {
            logger.error('情感记录添加失败:', error);
            throw error;
        }
    }

    /**
     * 添加对话会话
     * @param {string} userId - 用户ID
     * @param {Object} sessionData - 会话数据
     * @returns {Promise<Object>} 保存结果
     */
    async addChatSession(userId, sessionData) {
        try {
            const userData = this.userData.get(userId);
            if (!userData) {
                throw new Error('用户数据不存在');
            }

            const chatSession = {
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                ...sessionData
            };

            userData.chatSessions.push(chatSession);
            
            // 保持最近50个会话
            if (userData.chatSessions.length > 50) {
                userData.chatSessions = userData.chatSessions.slice(-50);
            }

            userData.lastSync = new Date().toISOString();
            this.userData.set(userId, userData);

            logger.info('对话会话添加成功', { userId, sessionId: chatSession.id });

            return {
                success: true,
                data: {
                    chatSession,
                    message: '对话会话保存成功'
                }
            };

        } catch (error) {
            logger.error('对话会话添加失败:', error);
            throw error;
        }
    }

    /**
     * 更新用户偏好设置
     * @param {string} userId - 用户ID
     * @param {Object} preferences - 偏好设置
     * @returns {Promise<Object>} 更新结果
     */
    async updateUserPreferences(userId, preferences) {
        try {
            const user = this.users.get(userId);
            if (!user) {
                throw new Error('用户不存在');
            }

            user.preferences = { ...user.preferences, ...preferences };
            this.users.set(userId, user);

            // 同时更新本地数据
            const userData = this.userData.get(userId);
            if (userData) {
                userData.preferences = user.preferences;
                userData.lastSync = new Date().toISOString();
                this.userData.set(userId, userData);
            }

            logger.info('用户偏好设置更新成功', { userId, preferences });

            return {
                success: true,
                data: {
                    preferences: user.preferences,
                    message: '偏好设置更新成功'
                }
            };

        } catch (error) {
            logger.error('用户偏好设置更新失败:', error);
            throw error;
        }
    }

    /**
     * 更新用户隐私设置
     * @param {string} userId - 用户ID
     * @param {Object} privacySettings - 隐私设置
     * @returns {Promise<Object>} 更新结果
     */
    async updateUserPrivacySettings(userId, privacySettings) {
        try {
            const user = this.users.get(userId);
            if (!user) {
                throw new Error('用户不存在');
            }

            user.privacySettings = { ...user.privacySettings, ...privacySettings };
            this.users.set(userId, user);

            // 同时更新本地数据
            const userData = this.userData.get(userId);
            if (userData) {
                userData.privacySettings = user.privacySettings;
                userData.lastSync = new Date().toISOString();
                this.userData.set(userId, userData);
            }

            logger.info('用户隐私设置更新成功', { userId, privacySettings });

            return {
                success: true,
                data: {
                    privacySettings: user.privacySettings,
                    message: '隐私设置更新成功'
                }
            };

        } catch (error) {
            logger.error('用户隐私设置更新失败:', error);
            throw error;
        }
    }

    /**
     * 获取用户统计信息
     * @param {string} userId - 用户ID
     * @returns {Object} 统计信息
     */
    getUserStats(userId) {
        const userData = this.userData.get(userId);
        if (!userData) {
            throw new Error('用户数据不存在');
        }

        const emotionCount = userData.emotionHistory.length;
        const chatCount = userData.chatSessions.length;
        const lastEmotion = userData.emotionHistory[userData.emotionHistory.length - 1];
        const lastChat = userData.chatSessions[userData.chatSessions.length - 1];

        return {
            emotionCount,
            chatCount,
            lastEmotion: lastEmotion ? {
                emotion: lastEmotion.emotion,
                timestamp: lastEmotion.timestamp
            } : null,
            lastChat: lastChat ? {
                title: lastChat.title || '未命名对话',
                timestamp: lastChat.timestamp
            } : null,
            lastSync: userData.lastSync
        };
    }

    /**
     * 导出用户数据
     * @param {string} userId - 用户ID
     * @returns {Object} 导出的数据
     */
    exportUserData(userId) {
        const user = this.users.get(userId);
        const userData = this.userData.get(userId);
        
        if (!user || !userData) {
            throw new Error('用户数据不存在');
        }

        const { password: _, ...userInfo } = user;

        return {
            user: userInfo,
            data: userData,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    /**
     * 删除用户数据
     * @param {string} userId - 用户ID
     * @returns {Promise<Object>} 删除结果
     */
    async deleteUserData(userId) {
        try {
            this.users.delete(userId);
            this.userData.delete(userId);
            
            // 删除相关会话
            for (const [sessionId, session] of this.userSessions.entries()) {
                if (session.userId === userId) {
                    this.userSessions.delete(sessionId);
                }
            }

            logger.info('用户数据删除成功', { userId });

            return {
                success: true,
                message: '用户数据删除成功'
            };

        } catch (error) {
            logger.error('用户数据删除失败:', error);
            throw error;
        }
    }
}

module.exports = UserService;
