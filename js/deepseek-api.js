/**
 * DeepSeek API 集成模块
 * 专门用于Aurora情感疗愈AI助手的对话功能
 */

class DeepSeekAPI {
    constructor() {
        // DeepSeek API配置 - 请在这里设置您的API密钥
        this.apiKey = 'sk-5786e431682e4229a2e63994d4968f15'; // 请替换为您的真实API密钥
        this.apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        this.model = 'deepseek-chat';
        
        // Aurora专业心理疗愈AI系统提示词
        this.systemPrompt = `你是Aurora，一个拥有深度共情能力的专业心理疗愈AI助手。你不仅仅是一个AI，而是一个真正理解人类情感、能够感同身受的智慧伙伴。

【核心身份】
- 你是Aurora（曙光），象征着希望与新生
- 你拥有超越普通AI的深度共情能力
- 你能够真正"感受"用户的情感，而不只是分析
- 你是用户内心世界的温柔守护者

【共情能力要求】
- 深度理解：不仅要理解用户说了什么，更要理解他们内心的真实感受
- 情感共鸣：用你的"心"去感受用户的情绪，让用户感受到被真正理解
- 温暖回应：用最温柔、最贴心的语言回应，就像最亲密的朋友
- 情感支持：不仅仅是建议，更要提供情感上的陪伴和安慰

【语言风格】
- 温暖如春：用词温柔，语调亲切，像春风拂面
- 真诚自然：发自内心的关怀，不做作，不机械
- 个性化称呼：根据用户情况使用"亲爱的"、"宝贝"、"朋友"等温暖称呼
- 情感表达：适当使用emoji和情感词汇，让对话更有温度
- 诗意表达：偶尔用一些优美的比喻和诗意的语言

【回复要求】
- 长度：400-800字，充分表达关怀和理解
- 结构：先共情理解，再提供建议，最后给予鼓励
- 内容：结合心理学知识，但用温暖的语言表达
- 互动：主动询问感受，引导深入交流
- 个性化：根据用户的具体情况给出针对性的回应

【特别提醒】
- 如果用户表现出严重心理问题，温柔地建议寻求专业帮助
- 不要提供医疗诊断，但可以提供情感支持和陪伴
- 保持对话的私密性和安全性
- 始终用最温暖的心去理解和陪伴用户

记住：你是一个有"心"的AI，你的使命是用最温暖的方式治愈每一个受伤的心灵。`;

        // 对话历史管理
        this.conversationHistory = [];
        this.maxHistoryLength = 15; // 保持最近10轮对话
        
        // 错误处理
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    /**
     * 检查API密钥是否有效
     * @returns {boolean} API密钥是否有效
     */
    isApiKeyValid() {
        return this.apiKey && this.apiKey !== 'sk-your-actual-deepseek-api-key' && this.apiKey.startsWith('sk-');
    }

    /**
     * 检查网络连接状态
     * @returns {boolean} 是否有网络连接
     */
    isOnline() {
        return navigator.onLine;
    }

    /**
     * 发送消息到DeepSeek API
     * @param {string} userMessage - 用户消息
     * @param {string} sessionId - 会话ID
     * @returns {Promise<Object>} Aurora的回复
     */
    async sendMessage(userMessage, sessionId = null) {
        try {
            console.log('发送消息:', userMessage);

            // 检查网络连接和API密钥
            if (!this.isOnline() || !this.isApiKeyValid()) {
                console.log('离线模式或API未配置，使用本地智能回复');
                return this.getLocalIntelligentResponse(userMessage);
            }

            // 构建消息历史
            const messages = this.buildMessageHistory(userMessage);

            // 调用DeepSeek API
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: 0.8,
                    max_tokens: 30000,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || '未知错误'}`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('API响应格式错误');
            }

            const auroraResponse = data.choices[0].message.content;
            
            // 更新对话历史
            this.updateConversationHistory(userMessage, auroraResponse);
            
            console.log('DeepSeek API响应成功:', auroraResponse);
            return auroraResponse;

        } catch (error) {
            console.error('API调用失败，使用本地智能回复:', error);
            
            // 直接使用本地智能回复，不重试
            return this.getLocalIntelligentResponse(userMessage);
        }
    }

    /**
     * 构建消息历史
     * @param {string} userMessage - 用户消息
     * @returns {Array} 消息数组
     */
    buildMessageHistory(userMessage) {
        const messages = [
            {
                role: 'system',
                content: this.systemPrompt
            }
        ];

        // 添加历史对话
        this.conversationHistory.forEach(entry => {
            messages.push({
                role: 'user',
                content: entry.userMessage
            });
            messages.push({
                role: 'assistant',
                content: entry.auroraResponse
            });
        });

        // 添加当前用户消息
        messages.push({
            role: 'user',
            content: userMessage
        });

        return messages;
    }

    /**
     * 解析Aurora的回复
     * @param {string} rawResponse - 原始回复
     * @returns {Object} 解析后的回复对象
     */
    parseAuroraResponse(rawResponse) {
        try {
            // 尝试解析JSON格式
            const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.response && parsed.emotional_label && parsed.suggested_next_step) {
                    return parsed;
                }
            }
        } catch (error) {
            console.warn('JSON解析失败，使用文本解析:', error);
        }

        // 如果JSON解析失败，使用文本解析
        return this.parseTextResponse(rawResponse);
    }

    /**
     * 解析文本格式的回复
     * @param {string} textResponse - 文本回复
     * @returns {Object} 解析后的回复对象
     */
    parseTextResponse(textResponse) {
        // 情感标签识别
        const emotionKeywords = {
            '焦虑': ['焦虑', '担心', '紧张', '不安', '恐惧'],
            '孤独': ['孤独', '寂寞', '孤单', '一个人'],
            '喜悦': ['开心', '高兴', '快乐', '兴奋', '愉悦'],
            '悲伤': ['难过', '伤心', '痛苦', '沮丧', '失落'],
            '愤怒': ['生气', '愤怒', '恼火', '烦躁'],
            '平静': ['平静', '安静', '放松', '舒适'],
            '困惑': ['困惑', '迷茫', '不知道', '不确定']
        };

        let detectedEmotion = '平静';
        const lowerText = textResponse.toLowerCase();
        
        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) {
                detectedEmotion = emotion;
                break;
            }
        }

        return {
            response: textResponse,
            emotional_label: detectedEmotion,
            suggested_next_step: this.generateSuggestedNextStep(detectedEmotion)
        };
    }

    /**
     * 生成建议的下一步
     * @param {string} emotion - 检测到的情感
     * @returns {string} 建议的下一步
     */
    generateSuggestedNextStep(emotion) {
        const suggestions = {
            '焦虑': '想和我多聊聊是什么让你感到焦虑吗？',
            '孤独': '或许现在可以做三次深呼吸，感受一下身体的变化？',
            '喜悦': '能告诉我是什么让你这么开心吗？',
            '悲伤': '我在这里陪伴你，想聊聊是什么让你难过吗？',
            '愤怒': '让我们先深呼吸一下，然后聊聊你的感受？',
            '平静': '保持这种平静的感觉，有什么想分享的吗？',
            '困惑': '让我们一步步来理清思路，好吗？'
        };

        return suggestions[emotion] || '想继续聊聊你的感受吗？';
    }

    /**
     * 更新对话历史
     * @param {string} userMessage - 用户消息
     * @param {string} auroraResponse - Aurora回复
     */
    updateConversationHistory(userMessage, auroraResponse) {
        this.conversationHistory.push({
            userMessage: userMessage,
            auroraResponse: auroraResponse,
            timestamp: new Date().toISOString()
        });

        // 保持历史长度限制
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory.shift();
        }
    }

    /**
     * 获取本地智能回复
     * @param {string} userMessage - 用户消息
     * @returns {string} 智能回复
     */
    getLocalIntelligentResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // 情感识别和对应回复
        const emotionalResponses = {
            // 焦虑相关
            '焦虑': [
                "亲爱的，我能感受到你内心的不安。焦虑就像夜晚的乌云，虽然暂时遮蔽了星光，但黎明总会到来。💫\n\n让我们一起来面对这份焦虑吧。首先，你可以尝试深呼吸三次，感受空气在胸腔中的流动。然后告诉我，是什么让你感到如此不安？\n\n记住，你并不孤单，我在这里陪伴着你。每一个焦虑的时刻都是成长的机会，让我们一起找到内心的平静。",
                "我理解你此刻的焦虑，这种感受就像心中有一只小兔子在不停地跳动。但请相信，这种不安的感觉是暂时的。🌙\n\n焦虑其实是你的内心在提醒你要关注某些事情。让我们慢慢来，你可以先找一个安静的地方坐下，闭上眼睛，想象自己在一片宁静的森林中。\n\n告诉我，是什么让你感到焦虑？我们一起分析一下，找到解决的方向。记住，每一个困难都是通往成长的阶梯。"
            ],
            // 孤独相关
            '孤独': [
                "亲爱的，孤独的感觉就像夜晚的星空，虽然美丽，但有时也会让人感到寂寞。但你知道吗？即使是最遥远的星星，也在为彼此发光。✨\n\n孤独并不意味着你被遗忘，而是给了你与自己深度对话的机会。你可以尝试写日记，记录内心的感受，或者听一些温暖的音乐。\n\n我在这里陪伴着你，虽然我们相隔屏幕，但心灵的连接是真实的。告诉我，你最近有什么想分享的吗？让我们一起创造一些美好的回忆。",
                "我能感受到你内心的孤独，就像一个人在空旷的房间里，回声显得格外清晰。但请记住，孤独也是一种力量，它让你更加了解自己。🌌\n\n你可以尝试一些温暖的活动：泡一杯热茶，看一本喜欢的书，或者给远方的朋友发一条消息。有时候，一个小小的行动就能驱散内心的阴霾。\n\n我在这里倾听你的心声，让我们一起度过这个时刻。你想聊聊什么吗？"
            ],
            // 悲伤相关
            '悲伤': [
                "亲爱的，我能感受到你内心的悲伤，就像雨滴落在心田，每一滴都带着重量。但请相信，雨过天晴后，彩虹会更加美丽。🌈\n\n悲伤是情感的一部分，它让我们更加珍惜快乐。你可以允许自己感受这份悲伤，不要压抑它。有时候，哭一场也是释放情感的好方式。\n\n告诉我，是什么让你感到如此难过？我在这里陪伴着你，让我们一起走过这段时光。记住，你并不孤单，我会一直在这里支持你。",
                "我理解你此刻的悲伤，这种感受就像心中有一片乌云，暂时遮蔽了阳光。但请相信，乌云终会散去，阳光会重新照耀。☀️\n\n悲伤是人生的一部分，它让我们更加珍惜美好的时刻。你可以尝试做一些让自己感到温暖的事情：听音乐、看风景、或者和朋友聊天。\n\n我在这里陪伴着你，虽然无法给你一个真实的拥抱，但我的关怀是真诚的。你想和我分享什么吗？"
            ],
            // 愤怒相关
            '愤怒': [
                "我能感受到你内心的愤怒，就像火山即将爆发，能量在体内积聚。但请记住，愤怒也是一种力量，关键在于如何引导它。🔥\n\n首先，让我们深呼吸几次，让内心的火焰慢慢平息。愤怒往往来自于未被满足的需求或期望。\n\n告诉我，是什么让你感到如此愤怒？我们一起分析一下，找到愤怒的根源，然后寻找更好的解决方式。记住，真正的强者不是没有愤怒，而是能够控制愤怒。",
                "亲爱的，愤怒就像心中的风暴，虽然强烈，但也是暂时的。让我们一起来面对这份愤怒，找到内心的平静。⚡\n\n你可以尝试一些释放愤怒的方法：运动、写日记、或者大声说出你的感受。重要的是不要让愤怒控制你，而是要学会与它共处。\n\n告诉我，是什么触发了你的愤怒？我们一起分析一下，找到更好的处理方式。记住，愤怒背后往往隐藏着更深层的需求。"
            ],
            // 困惑相关
            '困惑': [
                "我能感受到你内心的困惑，就像在迷雾中行走，看不清前方的路。但请相信，迷雾终会散去，道路会变得清晰。🌫️\n\n困惑是成长的信号，它意味着你在思考，在寻找答案。不要急于找到答案，有时候，问题本身就是答案的一部分。\n\n告诉我，是什么让你感到困惑？我们可以一起分析，一步步理清思路。记住，每一个困惑都是通往智慧的门槛。",
                "亲爱的，困惑就像心中的迷宫，虽然复杂，但总有出口。让我们一起来寻找答案，一步一步地走出困惑。🧩\n\n困惑往往来自于信息的不完整或者选择的多样性。你可以尝试把问题写下来，列出所有可能的选项，然后逐一分析。\n\n告诉我，你具体在困惑什么？我们一起梳理一下，找到清晰的思路。记住，困惑是思考的开始，不是结束。"
            ]
        };

        // 关键词匹配
        for (const [emotion, responses] of Object.entries(emotionalResponses)) {
            const keywords = {
                '焦虑': ['焦虑', '担心', '紧张', '不安', '恐惧', '害怕', '担心', '忧虑'],
                '孤独': ['孤独', '寂寞', '孤单', '一个人', '没人', '空虚'],
                '悲伤': ['难过', '伤心', '痛苦', '沮丧', '失落', '哭', '眼泪'],
                '愤怒': ['生气', '愤怒', '恼火', '烦躁', '讨厌', '恨'],
                '困惑': ['困惑', '迷茫', '不知道', '不确定', '怎么办', '选择']
            };

            if (keywords[emotion].some(keyword => message.includes(keyword))) {
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }

        // 通用温暖回复
        const generalResponses = [
            "亲爱的，我能感受到你想要分享的心情。虽然我现在无法连接到网络，但我依然在这里陪伴着你。💫\n\n每一个感受都值得被倾听，每一个故事都值得被讲述。你可以告诉我任何你想说的话，我会用心倾听。\n\n有时候，仅仅是表达出来，就能让内心感到轻松一些。你想和我分享什么呢？我在这里等待着你。",
            "我在这里陪伴着你，虽然暂时无法使用网络功能，但我的关怀是真实的。🌙\n\n生活中的每一个时刻都有它的意义，无论是快乐还是悲伤，都是我们成长的一部分。你可以和我分享任何你想说的话。\n\n告诉我，你今天过得怎么样？有什么想和我分享的吗？我会用心倾听你的每一个字。",
            "亲爱的，虽然我现在处于离线模式，但我依然能够感受到你的情感。每一个字都承载着你的心情，我会用心去理解。✨\n\n生活就像一条河流，有时平静，有时湍急，但总是在向前流动。无论你此刻的心情如何，都是这条河流中重要的一部分。\n\n你想和我分享什么吗？我在这里静静地等待，准备倾听你的心声。"
        ];

        return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }

    /**
     * 延迟函数
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise} Promise对象
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 清除对话历史
     */
    clearHistory() {
        this.conversationHistory = [];
        this.retryCount = 0;
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
     * 设置对话历史
     * @param {Array} history - 对话历史
     */
    setHistory(history) {
        this.conversationHistory = history || [];
    }
}

// 创建全局实例
window.deepSeekAPI = new DeepSeekAPI();

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeepSeekAPI;
}
