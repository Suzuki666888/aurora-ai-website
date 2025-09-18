/**
 * Aurora认证管理器
 * 处理用户认证、token管理、API调用等
 */

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('aurora_token');
        this.refreshToken = localStorage.getItem('aurora_refresh_token');
        this.user = JSON.parse(localStorage.getItem('aurora_user') || 'null');
        this.apiBaseUrl = 'http://localhost:3000/api/v1';
        
        // 绑定方法
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.register = this.register.bind(this);
        this.refreshAccessToken = this.refreshAccessToken.bind(this);
    }

    /**
     * 用户登录
     * @param {string} email - 用户邮箱
     * @param {string} password - 用户密码
     * @returns {Promise<Object>} 用户信息
     */
    async login(email, password) {
        try {
            console.log('开始用户登录...');
            
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (data.success) {
                // 保存token和用户信息
                this.token = data.data.tokens.accessToken;
                this.refreshToken = data.data.tokens.refreshToken;
                this.user = data.data.user;
                
                localStorage.setItem('aurora_token', this.token);
                localStorage.setItem('aurora_refresh_token', this.refreshToken);
                localStorage.setItem('aurora_user', JSON.stringify(this.user));
                
                console.log('用户登录成功:', this.user.email);
                return this.user;
            } else {
                throw new Error(data.message || '登录失败');
            }
        } catch (error) {
            console.error('登录失败:', error);
            throw error;
        }
    }

    /**
     * 用户注册
     * @param {Object} userData - 用户注册数据
     * @returns {Promise<Object>} 用户信息
     */
    async register(userData) {
        try {
            console.log('开始用户注册...');
            
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('用户注册成功:', userData.email);
                return data.data;
            } else {
                throw new Error(data.message || '注册失败');
            }
        } catch (error) {
            console.error('注册失败:', error);
            throw error;
        }
    }

    /**
     * 刷新访问令牌
     * @returns {Promise<string>} 新的访问令牌
     */
    async refreshAccessToken() {
        try {
            if (!this.refreshToken) {
                throw new Error('没有刷新令牌');
            }

            const response = await fetch(`${this.apiBaseUrl}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken: this.refreshToken })
            });

            const data = await response.json();
            
            if (data.success) {
                this.token = data.data.accessToken;
                localStorage.setItem('aurora_token', this.token);
                console.log('访问令牌刷新成功');
                return this.token;
            } else {
                throw new Error('令牌刷新失败');
            }
        } catch (error) {
            console.error('令牌刷新失败:', error);
            this.logout();
            throw error;
        }
    }

    /**
     * 用户登出
     */
    logout() {
        console.log('用户登出');
        
        // 清除本地存储
        this.token = null;
        this.refreshToken = null;
        this.user = null;
        
        localStorage.removeItem('aurora_token');
        localStorage.removeItem('aurora_refresh_token');
        localStorage.removeItem('aurora_user');
        
        // 重定向到登录页面或首页
        window.location.href = 'index.html';
    }

    /**
     * 获取认证令牌
     * @returns {string|null} 访问令牌
     */
    getAuthToken() {
        return this.token;
    }

    /**
     * 检查用户是否已认证
     * @returns {boolean} 是否已认证
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * 获取当前用户信息
     * @returns {Object|null} 用户信息
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * 带认证的API调用
     * @param {string} url - API端点
     * @param {Object} options - 请求选项
     * @returns {Promise<Response>} 响应对象
     */
    async authenticatedFetch(url, options = {}) {
        const token = this.getAuthToken();
        
        if (!token) {
            throw new Error('用户未认证');
        }

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        
        // 如果token过期，尝试刷新
        if (response.status === 401) {
            try {
                await this.refreshAccessToken();
                // 重试请求
                const retryOptions = {
                    ...defaultOptions,
                    ...options,
                    headers: {
                        ...defaultOptions.headers,
                        'Authorization': `Bearer ${this.token}`
                    }
                };
                return await fetch(url, retryOptions);
            } catch (error) {
                console.error('认证失败，需要重新登录:', error);
                this.logout();
                throw error;
            }
        }

        return response;
    }

    /**
     * 情感分析API调用
     * @param {string} text - 要分析的文本
     * @param {Object} context - 上下文信息
     * @returns {Promise<Object>} 分析结果
     */
    async analyzeEmotion(text, context = {}) {
        try {
            const response = await this.authenticatedFetch(`${this.apiBaseUrl}/emotion/analyze`, {
                method: 'POST',
                body: JSON.stringify({ text, context })
            });

            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || '情感分析失败');
            }
        } catch (error) {
            console.error('情感分析失败:', error);
            throw error;
        }
    }

    /**
     * 情感对话API调用 - 使用DeepSeek API
     * @param {string} message - 用户消息
     * @param {string} sessionId - 会话ID
     * @returns {Promise<Object>} 对话结果
     */
    async chatWithAurora(message, sessionId) {
        try {
            // 检查是否使用DeepSeek API
            if (window.deepSeekAPI && window.deepSeekAPI.isApiKeyValid()) {
                console.log('使用DeepSeek API进行对话');
                return await window.deepSeekAPI.sendMessage(message, sessionId);
            }

            // 回退到本地API
            console.log('使用本地API进行对话');
            const response = await this.authenticatedFetch(`${this.apiBaseUrl}/emotion/chat`, {
                method: 'POST',
                body: JSON.stringify({ 
                    message, 
                    sessionId,
                    userId: this.user?.id 
                })
            });

            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || '对话失败');
            }
        } catch (error) {
            console.error('对话失败:', error);
            
            // 如果本地API也失败，尝试使用DeepSeek的备用回复
            if (window.deepSeekAPI) {
                console.log('使用DeepSeek备用回复');
                return await window.deepSeekAPI.getFallbackResponse(message);
            }
            
            throw error;
        }
    }


    /**
     * 获取DeepSeek API状态
     * @returns {Object} API状态信息
     */
    getDeepSeekApiStatus() {
        if (!window.deepSeekAPI) {
            return {
                available: false,
                reason: 'DeepSeek API模块未加载'
            };
        }

        const hasValidKey = window.deepSeekAPI.isApiKeyValid();

        return {
            available: hasValidKey,
            hasApiKey: hasValidKey,
            conversationHistory: window.deepSeekAPI.getHistory(),
            retryCount: window.deepSeekAPI.retryCount
        };
    }

    /**
     * 情感导航API调用
     * @param {string} currentEmotion - 当前情感
     * @param {string} targetEmotion - 目标情感
     * @param {Object} preferences - 用户偏好
     * @returns {Promise<Object>} 导航结果
     */
    async navigateEmotion(currentEmotion, targetEmotion, preferences = {}) {
        try {
            const response = await this.authenticatedFetch(`${this.apiBaseUrl}/emotion/navigate`, {
                method: 'POST',
                body: JSON.stringify({ 
                    currentEmotion, 
                    targetEmotion, 
                    preferences 
                })
            });

            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || '情感导航失败');
            }
        } catch (error) {
            console.error('情感导航失败:', error);
            throw error;
        }
    }

    /**
     * 获取用户情感状态
     * @param {string} timeframe - 时间范围
     * @returns {Promise<Object>} 情感状态
     */
    async getEmotionStatus(timeframe = 'day') {
        try {
            const response = await this.authenticatedFetch(`${this.apiBaseUrl}/emotion/status?timeframe=${timeframe}`);
            
            const data = await response.json();
            
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || '获取情感状态失败');
            }
        } catch (error) {
            console.error('获取情感状态失败:', error);
            throw error;
        }
    }
}

// 创建全局实例
window.authManager = new AuthManager();

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
