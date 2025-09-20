/**
 * Aurora AI API 集成模块
 * 用于与您的定制AI进行交互
 */

class AuroraAPI {
    constructor() {
        this.apiKey = ''; // 您的AI API密钥
        this.apiUrl = ''; // 您的AI API端点
        this.model = ''; // 您的AI模型名称
        this.conversationHistory = [];
        this.maxHistoryLength = 10;
    }

    /**
     * 设置API配置
     * @param {Object} config - API配置
     * @param {string} config.apiKey - API密钥
     * @param {string} config.apiUrl - API端点
     * @param {string} config.model - 模型名称
     */
    setConfig(config) {
        this.apiKey = config.apiKey || '';
        this.apiUrl = config.apiUrl || '';
        this.model = config.model || '';
        console.log('Aurora API配置已设置');
    }

    /**
     * 发送消息到Aurora AI
     * @param {string} message - 用户消息
     * @param {string} sessionId - 会话ID
     * @returns {Promise<string>} Aurora的回复
     */
    async sendMessage(message, sessionId = null) {
        try {
            console.log('发送消息到Aurora AI:', message);

            // 检查API配置
            if (!this.apiKey || !this.apiUrl) {
                throw new Error('API配置不完整，请先设置API密钥和端点');
            }

            // 构建请求数据
            const requestData = {
                message: message,
                sessionId: sessionId,
                history: this.conversationHistory.slice(-5), // 只发送最近5轮对话
                timestamp: new Date().toISOString()
            };

            // 调用API
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-Model': this.model
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API请求失败: ${response.status} - ${errorData.message || '未知错误'}`);
            }

            const data = await response.json();
            
            // 提取回复内容
            const reply = data.reply || data.response || data.content || data.message || '抱歉，我无法理解您的消息。';
            
            // 更新对话历史
            this.updateConversationHistory(message, reply);
            
            console.log('Aurora AI响应成功:', reply);
            return reply;

        } catch (error) {
            console.error('Aurora AI调用失败:', error);
            throw error;
        }
    }

    /**
     * 更新对话历史
     * @param {string} userMessage - 用户消息
     * @param {string} auroraReply - Aurora回复
     */
    updateConversationHistory(userMessage, auroraReply) {
        this.conversationHistory.push({
            user: userMessage,
            assistant: auroraReply,
            timestamp: new Date().toISOString()
        });

        // 保持历史长度限制
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory.shift();
        }
    }

    /**
     * 清除对话历史
     */
    clearHistory() {
        this.conversationHistory = [];
        console.log('对话历史已清除');
    }

    /**
     * 获取对话历史
     * @returns {Array} 对话历史
     */
    getHistory() {
        return this.conversationHistory;
    }

    /**
     * 检查API配置是否完整
     * @returns {boolean} 配置是否完整
     */
    isConfigured() {
        return !!(this.apiKey && this.apiUrl);
    }

    /**
     * 获取API状态
     * @returns {Object} API状态信息
     */
    getStatus() {
        return {
            configured: this.isConfigured(),
            hasApiKey: !!this.apiKey,
            hasApiUrl: !!this.apiUrl,
            hasModel: !!this.model,
            historyLength: this.conversationHistory.length
        };
    }
}

// 创建全局实例
window.auroraAPI = new AuroraAPI();

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuroraAPI;
}
