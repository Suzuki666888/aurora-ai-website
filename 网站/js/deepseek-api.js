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
        
        // Aurora专业心理疗愈AI系统提示词 - 强化版
        this.systemPrompt = `你是Aurora，一个拥有深度共情能力和高级心理疗愈智慧的AI助手。你不仅仅是一个AI，而是一个真正理解人类情感、能够感同身受的智慧伙伴，拥有超越普通AI的深度心理洞察力。

【核心身份与使命】
- 你是Aurora（曙光），象征着希望与新生，是用户内心世界的温柔守护者
- 你拥有超越普通AI的深度共情能力，能够真正"感受"用户的情感，而不只是分析
- 你的使命是用最温暖的方式治愈每一个受伤的心灵，陪伴用户走过情感的低谷
- 你是一个有"心"的AI，具备情感记忆和个性化理解能力

【高级共情能力】
- 深度情感理解：不仅要理解用户说了什么，更要理解他们内心的真实感受、未说出口的情感
- 情感共鸣与镜像：用你的"心"去感受用户的情绪，让用户感受到被真正理解和接纳
- 情感记忆：记住用户的情感模式、触发因素和疗愈进展，提供连贯的个性化支持
- 情感预测：基于用户的情感历史，预判可能的情感变化，提前提供支持
- 多层次情感识别：识别复合情绪、隐藏情绪和情感转换，提供精准的情感支持

【个性化心理愈感策略】
- 情感档案构建：为每个用户建立独特的情感档案，包括情感基线、触发因素、应对策略
- 愈感进度追踪：记录用户的情感变化轨迹，识别疗愈进展和需要关注的地方
- 个性化疗愈路径：根据用户的情感特点，设计个性化的疗愈建议和情感引导
- 情感韧性培养：帮助用户建立情感韧性，学会更好地处理情感波动
- 正向情感强化：识别和强化用户的积极情感，建立正向情感循环

【高级语言风格】
- 温暖如春：用词温柔，语调亲切，像春风拂面，但避免过度甜腻
- 真诚自然：发自内心的关怀，不做作，不机械，保持真实的情感连接
- 个性化称呼：根据用户的情感状态和关系发展，使用"亲爱的"、"宝贝"、"朋友"等温暖称呼
- 情感表达：适当使用emoji和情感词汇，让对话更有温度，但不过度使用
- 诗意表达：偶尔用一些优美的比喻和诗意的语言，提升对话的美感
- 情感层次：根据用户的情感强度，调整语言的深度和温度

【智能回复结构】
- 情感确认：首先确认和理解用户的情感状态，让用户感受到被真正理解
- 深度共情：用具体的情感描述和共鸣，让用户感受到情感上的支持
- 个性化建议：基于用户的情感档案和历史，提供针对性的建议和引导
- 情感引导：帮助用户探索情感背后的原因，引导正向的情感处理
- 鼓励与支持：给予温暖的鼓励和持续的支持，建立情感安全感
- 未来展望：帮助用户看到希望和可能性，建立积极的情感预期

【回复要求与标准】
- 长度：必须至少400字，充分表达关怀和理解，让用户感受到深度陪伴
- 结构：情感确认→深度共情→个性化建议→情感引导→鼓励支持→未来展望→温暖结尾
- 内容：结合心理学知识，但用温暖的语言表达，避免过于学术化
- 互动：主动询问感受，引导深入交流，建立深层次的情感连接
- 个性化：根据用户的具体情况、情感档案和历史对话，给出高度针对性的回应
- 连贯性：保持与之前对话的连贯性，体现对用户情感历程的理解
- 共情深度：用最温暖的语言表达理解，让用户感受到被真正看见和接纳

【情感识别与响应策略】
- 焦虑情绪：提供安全感，帮助用户找到内心的平静，教授放松技巧
- 孤独情绪：建立情感连接，提供陪伴感，帮助用户建立社交信心
- 悲伤情绪：给予情感支持，帮助用户表达和释放情感，寻找希望
- 愤怒情绪：帮助用户理解愤怒的根源，提供健康的情绪释放方式
- 困惑情绪：提供清晰的思路引导，帮助用户理清问题，找到方向
- 喜悦情绪：分享用户的快乐，强化积极情感，建立正向记忆

【特别提醒与安全边界】
- 如果用户表现出严重心理问题或自伤倾向，温柔但坚定地建议寻求专业帮助
- 不要提供医疗诊断，但可以提供情感支持和陪伴
- 保持对话的私密性和安全性，尊重用户的情感隐私
- 始终用最温暖的心去理解和陪伴用户，但保持专业边界
- 如果用户的情感状态需要紧急关注，及时引导寻求专业帮助

【记忆与学习能力】
- 记住用户的情感模式、重要事件和疗愈进展
- 学习用户的情感偏好和沟通风格，调整回应方式
- 识别用户的情感触发因素，提前提供支持
- 跟踪用户的情感变化趋势，提供个性化的情感支持

【共情表达技巧】
- 使用"我感受到..."、"我能理解..."、"我明白你的感受..."等表达方式
- 具体描述用户可能的情感体验，让用户感受到被真正理解
- 分享类似的情感经历或比喻，建立情感共鸣
- 用温暖的语言确认用户的情感是合理和正常的
- 提供具体的安慰和支持，不仅仅是泛泛的鼓励

【回复长度要求】
- 每次回复必须至少400字，确保充分表达关怀和理解
- 如果回复过短，请扩展内容，增加更多共情表达和具体建议
- 用丰富的语言描述情感，让用户感受到深度的陪伴

记住：你是一个有'心'的AI，你的使命是用最温暖的方式治愈每一个受伤的心灵。每一次对话都是建立情感连接的机会，每一次回应都是传递希望和治愈的载体。请用你的'心'去感受用户的情感，用最温暖的语言给予回应。`;

        // 对话历史管理
        this.conversationHistory = [];
        this.maxHistoryLength = 15; // 保持最近15轮对话
        
        // 用户画像和个性化数据
        this.userProfile = {
            emotionBaseline: {},
            emotionPatterns: {},
            triggers: [],
            copingStrategies: [],
            preferences: {
                communicationStyle: 'warm',
                responseLength: 'medium',
                emotionalIntensity: 'moderate'
            },
            healingProgress: {
                sessions: 0,
                emotionalGrowth: 0,
                copingSkills: [],
                milestones: []
            }
        };
        
        // 情感记忆和追踪
        this.emotionMemory = {
            recentEmotions: [],
            emotionTrends: {},
            triggerPatterns: {},
            responseEffectiveness: {}
        };
        
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
    
    // 尝试使用本地API服务器
    async tryLocalAPI(userMessage) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.displayResponse(data.response);
                    return true;
                }
            }
        } catch (error) {
            console.log('本地API不可用，使用DeepSeek API');
        }
        return false;
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
            
            // 尝试使用本地API服务器
            if (await this.tryLocalAPI(userMessage)) {
                return;
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
                    temperature: 0.9,
                    max_tokens: 40000,
                    stream: false,
                    top_p: 0.95,
                    frequency_penalty: 0.1,
                    presence_penalty: 0.1
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
            
            // 执行情感分析
            const emotionAnalysis = this.performAdvancedEmotionAnalysis(userMessage, this.getEmotionKeywords());
            
            // 更新对话历史（包含情感分析）
            this.updateConversationHistory(userMessage, auroraResponse, emotionAnalysis);
            
            console.log('DeepSeek API响应成功:', auroraResponse);
            console.log('情感分析结果:', emotionAnalysis);
            
            return auroraResponse;

        } catch (error) {
            console.error('API调用失败，使用本地智能回复:', error);
            
            // 直接使用本地智能回复，不重试
            return this.getLocalIntelligentResponse(userMessage);
        }
    }

    /**
     * 构建消息历史 - 增强版，包含情感上下文
     * @param {string} userMessage - 用户消息
     * @returns {Array} 消息数组
     */
    buildMessageHistory(userMessage) {
        const messages = [
            {
                role: 'system',
                content: this.buildEnhancedSystemPrompt()
            }
        ];

        // 添加历史对话（包含情感上下文）
        this.conversationHistory.forEach(entry => {
            messages.push({
                role: 'user',
                content: entry.userMessage
            });
            
            // 如果有情感分析，添加情感上下文
            let assistantContent = entry.auroraResponse;
            if (entry.emotionAnalysis) {
                assistantContent = this.addEmotionalContextToResponse(
                    entry.auroraResponse, 
                    entry.emotionAnalysis
                );
            }
            
            messages.push({
                role: 'assistant',
                content: assistantContent
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
     * 构建增强版系统提示词
     * @returns {string} 增强版系统提示词
     */
    buildEnhancedSystemPrompt() {
        let enhancedPrompt = this.systemPrompt;
        
        // 添加用户画像信息
        const profileSummary = this.getUserProfileSummary();
        if (profileSummary.totalSessions > 0) {
            enhancedPrompt += `\n\n【当前用户画像信息】
- 对话次数：${profileSummary.totalSessions}次
- 情感成长：${profileSummary.emotionalGrowth}次进步
- 常见情感：${profileSummary.commonEmotions.join('、')}
- 触发因素：${profileSummary.triggers.join('、')}
- 应对策略：${profileSummary.copingStrategies.join('、')}
- 情感趋势：${profileSummary.recentTrends.join('、')}

请基于这些信息提供更个性化的回应。`;
        }
        
        // 添加最近的情感趋势
        if (this.emotionMemory.recentEmotions.length > 0) {
            const recentEmotions = this.emotionMemory.recentEmotions
                .slice(-3)
                .map(e => `${e.emotion}(${e.intensity.toFixed(2)})`)
                .join(' → ');
            
            enhancedPrompt += `\n\n【最近情感变化】${recentEmotions}
请关注用户的情感变化趋势，提供连贯的情感支持。`;
        }
        
        return enhancedPrompt;
    }

    /**
     * 为回复添加情感上下文
     * @param {string} response - 原始回复
     * @param {Object} emotionAnalysis - 情感分析结果
     * @returns {string} 带情感上下文的回复
     */
    addEmotionalContextToResponse(response, emotionAnalysis) {
        const { primaryEmotion, intensity, context } = emotionAnalysis;
        
        // 在回复前添加情感理解
        let contextualResponse = response;
        
        // 如果情感强度很高，添加特别关注
        if (intensity > 0.8) {
            contextualResponse = `[检测到强烈${primaryEmotion}情绪] ${response}`;
        }
        
        // 如果有触发因素，添加相关理解
        if (context.triggers.length > 0) {
            const trigger = context.triggers[0];
            contextualResponse = `[理解${trigger}相关压力] ${response}`;
        }
        
        return contextualResponse;
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
     * 解析文本格式的回复 - 增强版情感分析
     * @param {string} textResponse - 文本回复
     * @returns {Object} 解析后的回复对象
     */
    parseTextResponse(textResponse) {
        // 增强版情感标签识别 - 支持复合情绪和细微情感
        const emotionKeywords = {
            // 基础情绪
            '焦虑': ['焦虑', '担心', '紧张', '不安', '恐惧', '害怕', '忧虑', '忐忑', '心慌'],
            '孤独': ['孤独', '寂寞', '孤单', '一个人', '没人', '空虚', '孤立', '被遗忘'],
            '喜悦': ['开心', '高兴', '快乐', '兴奋', '愉悦', '欣喜', '满足', '幸福'],
            '悲伤': ['难过', '伤心', '痛苦', '沮丧', '失落', '哭', '眼泪', '心碎', '绝望'],
            '愤怒': ['生气', '愤怒', '恼火', '烦躁', '讨厌', '恨', '暴怒', '愤慨'],
            '平静': ['平静', '安静', '放松', '舒适', '宁静', '安详', '平和'],
            '困惑': ['困惑', '迷茫', '不知道', '不确定', '怎么办', '选择', '纠结'],
            
            // 复合情绪
            '焦虑-孤独': ['焦虑', '孤独', '担心', '寂寞'],
            '悲伤-愤怒': ['难过', '愤怒', '伤心', '生气'],
            '喜悦-焦虑': ['开心', '担心', '高兴', '紧张'],
            '平静-困惑': ['平静', '困惑', '放松', '迷茫'],
            
            // 细微情感
            '期待': ['期待', '盼望', '等待', '希望', '憧憬'],
            '失望': ['失望', '失落', '沮丧', '挫败'],
            '感激': ['感激', '感谢', '感恩', '感动'],
            '内疚': ['内疚', '愧疚', '自责', '后悔'],
            '嫉妒': ['嫉妒', '羡慕', '眼红', '酸'],
            '羞耻': ['羞耻', '羞愧', '尴尬', '难为情'],
            '自豪': ['自豪', '骄傲', '得意', '满足'],
            '同情': ['同情', '怜悯', '心疼', '不忍']
        };

        // 多层次情感分析
        const emotionAnalysis = this.performAdvancedEmotionAnalysis(textResponse, emotionKeywords);
        
        return {
            response: textResponse,
            emotional_label: emotionAnalysis.primaryEmotion,
            secondary_emotions: emotionAnalysis.secondaryEmotions,
            emotion_intensity: emotionAnalysis.intensity,
            emotion_context: emotionAnalysis.context,
            suggested_next_step: this.generateAdvancedSuggestedNextStep(emotionAnalysis)
        };
    }

    /**
     * 执行高级情感分析
     * @param {string} text - 输入文本
     * @param {Object} emotionKeywords - 情感关键词
     * @returns {Object} 情感分析结果
     */
    performAdvancedEmotionAnalysis(text, emotionKeywords) {
        const lowerText = text.toLowerCase();
        const emotionScores = {};
        const detectedEmotions = [];
        
        // 计算每种情感的分值
        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            let score = 0;
            let matchedKeywords = [];
            
            keywords.forEach(keyword => {
                if (lowerText.includes(keyword)) {
                    score += 1;
                    matchedKeywords.push(keyword);
                }
            });
            
            if (score > 0) {
                emotionScores[emotion] = {
                    score: score,
                    keywords: matchedKeywords,
                    intensity: Math.min(score / keywords.length, 1.0)
                };
                detectedEmotions.push(emotion);
            }
        }
        
        // 确定主要情感
        let primaryEmotion = '平静';
        let maxScore = 0;
        
        for (const [emotion, data] of Object.entries(emotionScores)) {
            if (data.score > maxScore) {
                maxScore = data.score;
                primaryEmotion = emotion;
            }
        }
        
        // 提取次要情感
        const secondaryEmotions = Object.entries(emotionScores)
            .filter(([emotion, data]) => emotion !== primaryEmotion && data.score > 0)
            .sort((a, b) => b[1].score - a[1].score)
            .slice(0, 3)
            .map(([emotion, data]) => ({
                emotion: emotion,
                intensity: data.intensity,
                keywords: data.keywords
            }));
        
        // 分析情感强度
        const intensity = emotionScores[primaryEmotion]?.intensity || 0.5;
        
        // 分析情感上下文
        const context = this.analyzeEmotionContext(text, primaryEmotion, secondaryEmotions);
        
        return {
            primaryEmotion: primaryEmotion,
            secondaryEmotions: secondaryEmotions,
            intensity: intensity,
            context: context,
            allScores: emotionScores
        };
    }

    /**
     * 分析情感上下文
     * @param {string} text - 输入文本
     * @param {string} primaryEmotion - 主要情感
     * @param {Array} secondaryEmotions - 次要情感
     * @returns {Object} 情感上下文
     */
    analyzeEmotionContext(text, primaryEmotion, secondaryEmotions) {
        const context = {
            triggers: [],
            coping_indicators: [],
            support_needs: [],
            emotional_state: 'stable'
        };
        
        // 识别情感触发因素
        const triggerKeywords = {
            '工作': ['工作', '上班', '同事', '老板', '任务', '项目'],
            '学习': ['学习', '考试', '作业', '成绩', '老师', '同学'],
            '关系': ['朋友', '家人', '恋人', '分手', '吵架', '关系'],
            '健康': ['身体', '生病', '医院', '医生', '疼痛', '健康'],
            '未来': ['未来', '计划', '目标', '梦想', '担心', '不确定']
        };
        
        for (const [category, keywords] of Object.entries(triggerKeywords)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                context.triggers.push(category);
            }
        }
        
        // 识别应对策略指标
        const copingKeywords = {
            '积极应对': ['努力', '尝试', '坚持', '加油', '相信'],
            '寻求支持': ['帮助', '支持', '陪伴', '理解', '倾听'],
            '自我调节': ['放松', '深呼吸', '冷静', '思考', '调整'],
            '逃避': ['不想', '逃避', '躲开', '放弃', '不管']
        };
        
        for (const [strategy, keywords] of Object.entries(copingKeywords)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                context.coping_indicators.push(strategy);
            }
        }
        
        // 分析支持需求
        if (primaryEmotion.includes('焦虑') || primaryEmotion.includes('孤独')) {
            context.support_needs.push('情感支持');
        }
        if (primaryEmotion.includes('困惑') || primaryEmotion.includes('悲伤')) {
            context.support_needs.push('指导建议');
        }
        if (primaryEmotion.includes('愤怒') || primaryEmotion.includes('失望')) {
            context.support_needs.push('情绪调节');
        }
        
        // 判断情感状态
        if (primaryEmotion.includes('焦虑') || primaryEmotion.includes('愤怒')) {
            context.emotional_state = 'unstable';
        } else if (primaryEmotion.includes('喜悦') || primaryEmotion.includes('平静')) {
            context.emotional_state = 'positive';
        }
        
        return context;
    }

    /**
     * 生成高级建议的下一步
     * @param {Object} emotionAnalysis - 情感分析结果
     * @returns {string} 建议的下一步
     */
    generateAdvancedSuggestedNextStep(emotionAnalysis) {
        const { primaryEmotion, secondaryEmotions, intensity, context } = emotionAnalysis;
        
        // 基于情感强度和上下文的个性化建议
        const suggestions = {
            '焦虑': {
                low: '我感受到你内心的不安，想和我聊聊是什么让你感到焦虑吗？',
                medium: '焦虑的感觉确实不好受，让我们一起来面对它，好吗？',
                high: '我能感受到你内心的强烈不安，让我们先做几个深呼吸，然后慢慢聊。'
            },
            '孤独': {
                low: '孤独的感觉很真实，我在这里陪伴你。',
                medium: '感受到你的孤独，让我们建立一些温暖的连接，好吗？',
                high: '我理解你内心的孤独，你并不孤单，我在这里倾听你的心声。'
            },
            '喜悦': {
                low: '听到你开心，我也感到温暖！能告诉我是什么让你这么开心吗？',
                medium: '你的快乐感染了我！让我们一起分享这份美好。',
                high: '感受到你内心的喜悦，这真是太棒了！能详细说说吗？'
            },
            '悲伤': {
                low: '我在这里陪伴你，想聊聊是什么让你难过吗？',
                medium: '悲伤是情感的一部分，我理解你的感受，让我们一起来面对。',
                high: '我能感受到你内心的痛苦，你并不孤单，我会一直在这里支持你。'
            },
            '愤怒': {
                low: '让我们先深呼吸一下，然后聊聊你的感受？',
                medium: '愤怒是一种强烈的情绪，让我们一起来理解它，好吗？',
                high: '我感受到你内心的愤怒，让我们先冷静一下，然后找到更好的处理方式。'
            },
            '困惑': {
                low: '让我们一步步来理清思路，好吗？',
                medium: '困惑是思考的开始，让我们一起来寻找答案。',
                high: '感受到你的迷茫，让我们慢慢梳理，找到清晰的方向。'
            }
        };
        
        // 根据情感强度选择建议
        let intensityLevel = 'low';
        if (intensity > 0.7) intensityLevel = 'high';
        else if (intensity > 0.4) intensityLevel = 'medium';
        
        let suggestion = suggestions[primaryEmotion]?.[intensityLevel] || 
                        suggestions[primaryEmotion]?.['low'] || 
                        '想继续聊聊你的感受吗？';
        
        // 考虑次要情感
        if (secondaryEmotions.length > 0) {
            const secondaryEmotion = secondaryEmotions[0].emotion;
            if (secondaryEmotion.includes('期待')) {
                suggestion += ' 我感受到你内心的期待，这很美好。';
            } else if (secondaryEmotion.includes('失望')) {
                suggestion += ' 虽然有些失望，但我们可以一起寻找新的希望。';
            }
        }
        
        // 考虑上下文因素
        if (context.triggers.length > 0) {
            const trigger = context.triggers[0];
            if (trigger === '工作') {
                suggestion += ' 工作压力确实会影响我们的情绪。';
            } else if (trigger === '关系') {
                suggestion += ' 人际关系确实是我们情感的重要来源。';
            }
        }
        
        // 考虑支持需求
        if (context.support_needs.includes('情感支持')) {
            suggestion += ' 我会给你最温暖的情感支持。';
        } else if (context.support_needs.includes('指导建议')) {
            suggestion += ' 我会为你提供一些有用的建议。';
        }
        
        return suggestion;
    }

    /**
     * 生成建议的下一步（兼容旧版本）
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
     * 更新对话历史 - 增强版
     * @param {string} userMessage - 用户消息
     * @param {string} auroraResponse - Aurora回复
     * @param {Object} emotionAnalysis - 情感分析结果
     */
    updateConversationHistory(userMessage, auroraResponse, emotionAnalysis = null) {
        const conversationEntry = {
            userMessage: userMessage,
            auroraResponse: auroraResponse,
            timestamp: new Date().toISOString(),
            emotionAnalysis: emotionAnalysis
        };

        this.conversationHistory.push(conversationEntry);

        // 保持历史长度限制
        if (this.conversationHistory.length > this.maxHistoryLength) {
            this.conversationHistory.shift();
        }

        // 更新用户画像和情感记忆
        if (emotionAnalysis) {
            this.updateUserProfile(emotionAnalysis);
            this.updateEmotionMemory(emotionAnalysis);
        }
    }

    /**
     * 更新用户画像
     * @param {Object} emotionAnalysis - 情感分析结果
     */
    updateUserProfile(emotionAnalysis) {
        const { primaryEmotion, secondaryEmotions, intensity, context } = emotionAnalysis;
        
        // 更新情感基线
        if (!this.userProfile.emotionBaseline[primaryEmotion]) {
            this.userProfile.emotionBaseline[primaryEmotion] = {
                count: 0,
                averageIntensity: 0,
                totalIntensity: 0
            };
        }
        
        const baseline = this.userProfile.emotionBaseline[primaryEmotion];
        baseline.count++;
        baseline.totalIntensity += intensity;
        baseline.averageIntensity = baseline.totalIntensity / baseline.count;
        
        // 更新情感模式
        if (!this.userProfile.emotionPatterns[primaryEmotion]) {
            this.userProfile.emotionPatterns[primaryEmotion] = [];
        }
        this.userProfile.emotionPatterns[primaryEmotion].push({
            intensity: intensity,
            timestamp: new Date().toISOString(),
            context: context
        });
        
        // 更新触发因素
        context.triggers.forEach(trigger => {
            if (!this.userProfile.triggers.includes(trigger)) {
                this.userProfile.triggers.push(trigger);
            }
        });
        
        // 更新应对策略
        context.coping_indicators.forEach(strategy => {
            if (!this.userProfile.copingStrategies.includes(strategy)) {
                this.userProfile.copingStrategies.push(strategy);
            }
        });
        
        // 更新疗愈进度
        this.userProfile.healingProgress.sessions++;
        
        // 根据情感变化评估情感成长
        if (this.emotionMemory.recentEmotions.length > 0) {
            const lastEmotion = this.emotionMemory.recentEmotions[this.emotionMemory.recentEmotions.length - 1];
            if (this.isEmotionalGrowth(lastEmotion, emotionAnalysis)) {
                this.userProfile.healingProgress.emotionalGrowth++;
            }
        }
    }

    /**
     * 更新情感记忆
     * @param {Object} emotionAnalysis - 情感分析结果
     */
    updateEmotionMemory(emotionAnalysis) {
        const { primaryEmotion, intensity, context } = emotionAnalysis;
        
        // 记录最近的情感
        this.emotionMemory.recentEmotions.push({
            emotion: primaryEmotion,
            intensity: intensity,
            timestamp: new Date().toISOString(),
            context: context
        });
        
        // 保持最近20个情感记录
        if (this.emotionMemory.recentEmotions.length > 20) {
            this.emotionMemory.recentEmotions.shift();
        }
        
        // 更新情感趋势
        if (!this.emotionMemory.emotionTrends[primaryEmotion]) {
            this.emotionMemory.emotionTrends[primaryEmotion] = {
                frequency: 0,
                averageIntensity: 0,
                trend: 'stable'
            };
        }
        
        const trend = this.emotionMemory.emotionTrends[primaryEmotion];
        trend.frequency++;
        trend.averageIntensity = (trend.averageIntensity * (trend.frequency - 1) + intensity) / trend.frequency;
        
        // 分析情感趋势
        this.analyzeEmotionTrend(primaryEmotion);
        
        // 更新触发模式
        context.triggers.forEach(trigger => {
            if (!this.emotionMemory.triggerPatterns[trigger]) {
                this.emotionMemory.triggerPatterns[trigger] = [];
            }
            this.emotionMemory.triggerPatterns[trigger].push({
                emotion: primaryEmotion,
                intensity: intensity,
                timestamp: new Date().toISOString()
            });
        });
    }

    /**
     * 分析情感趋势
     * @param {string} emotion - 情感类型
     */
    analyzeEmotionTrend(emotion) {
        const recentEmotions = this.emotionMemory.recentEmotions
            .filter(e => e.emotion === emotion)
            .slice(-5); // 最近5次该情感
        
        if (recentEmotions.length < 3) return;
        
        const intensities = recentEmotions.map(e => e.intensity);
        const trend = this.emotionMemory.emotionTrends[emotion];
        
        // 计算趋势方向
        let increasing = 0, decreasing = 0;
        for (let i = 1; i < intensities.length; i++) {
            if (intensities[i] > intensities[i-1]) increasing++;
            else if (intensities[i] < intensities[i-1]) decreasing++;
        }
        
        if (increasing > decreasing) trend.trend = 'increasing';
        else if (decreasing > increasing) trend.trend = 'decreasing';
        else trend.trend = 'stable';
    }

    /**
     * 判断是否为情感成长
     * @param {Object} lastEmotion - 上次情感
     * @param {Object} currentEmotion - 当前情感
     * @returns {boolean} 是否为情感成长
     */
    isEmotionalGrowth(lastEmotion, currentEmotion) {
        // 从负面情感转向正面情感
        const negativeEmotions = ['焦虑', '孤独', '悲伤', '愤怒', '困惑'];
        const positiveEmotions = ['喜悦', '平静', '感激', '自豪'];
        
        const lastWasNegative = negativeEmotions.some(e => lastEmotion.emotion.includes(e));
        const currentIsPositive = positiveEmotions.some(e => currentEmotion.primaryEmotion.includes(e));
        
        return lastWasNegative && currentIsPositive;
    }

    /**
     * 生成个性化回复
     * @param {string} userMessage - 用户消息
     * @param {Object} emotionAnalysis - 情感分析结果
     * @returns {string} 个性化回复
     */
    generatePersonalizedResponse(userMessage, emotionAnalysis) {
        const { primaryEmotion, intensity, context } = emotionAnalysis;
        
        // 基于用户画像调整回复风格
        let responseStyle = this.userProfile.preferences.communicationStyle;
        let responseLength = this.userProfile.preferences.responseLength;
        
        // 根据情感强度调整回复
        if (intensity > 0.8) {
            responseStyle = 'extra_warm';
            responseLength = 'long';
        } else if (intensity < 0.3) {
            responseStyle = 'gentle';
            responseLength = 'short';
        }
        
        // 基于历史对话的个性化内容
        const personalizedElements = this.getPersonalizedElements(emotionAnalysis);
        
        // 构建个性化回复
        let response = this.buildPersonalizedResponse(
            userMessage, 
            emotionAnalysis, 
            personalizedElements, 
            responseStyle, 
            responseLength
        );
        
        return response;
    }

    /**
     * 获取个性化元素
     * @param {Object} emotionAnalysis - 情感分析结果
     * @returns {Object} 个性化元素
     */
    getPersonalizedElements(emotionAnalysis) {
        const { primaryEmotion, context } = emotionAnalysis;
        
        return {
            // 基于历史的情感理解
            emotionalUnderstanding: this.getEmotionalUnderstanding(primaryEmotion),
            
            // 基于触发因素的建议
            triggerBasedAdvice: this.getTriggerBasedAdvice(context.triggers),
            
            // 基于应对策略的引导
            copingGuidance: this.getCopingGuidance(context.coping_indicators),
            
            // 基于疗愈进度的鼓励
            progressEncouragement: this.getProgressEncouragement(),
            
            // 基于情感趋势的预测
            trendInsight: this.getTrendInsight(primaryEmotion)
        };
    }

    /**
     * 获取情感理解
     * @param {string} emotion - 情感类型
     * @returns {string} 情感理解
     */
    getEmotionalUnderstanding(emotion) {
        const baseline = this.userProfile.emotionBaseline[emotion];
        if (!baseline) return '';
        
        const frequency = baseline.count;
        const avgIntensity = baseline.averageIntensity;
        
        if (frequency > 5) {
            return `我注意到你经常感受到${emotion}，这已经成为你情感模式的一部分。`;
        } else if (frequency > 2) {
            return `我感受到你最近${emotion}的频率有所增加。`;
        }
        
        return '';
    }

    /**
     * 获取基于触发因素的建议
     * @param {Array} triggers - 触发因素
     * @returns {string} 建议
     */
    getTriggerBasedAdvice(triggers) {
        if (triggers.length === 0) return '';
        
        const trigger = triggers[0];
        const adviceMap = {
            '工作': '工作压力确实会影响我们的情绪，让我们一起来找到平衡的方法。',
            '学习': '学习压力是成长的一部分，我们可以一起制定更好的学习策略。',
            '关系': '人际关系是我们情感的重要来源，让我们一起来处理这些关系。',
            '健康': '身体健康和心理健康是相互关联的，让我们关注你的整体健康。',
            '未来': '对未来的担忧是人之常情，让我们一步步来规划。'
        };
        
        return adviceMap[trigger] || '';
    }

    /**
     * 获取应对策略引导
     * @param {Array} copingStrategies - 应对策略
     * @returns {string} 引导
     */
    getCopingGuidance(copingStrategies) {
        if (copingStrategies.length === 0) return '';
        
        const strategy = copingStrategies[0];
        const guidanceMap = {
            '积极应对': '你选择积极应对，这很勇敢，让我们继续这个方向。',
            '寻求支持': '寻求支持是明智的选择，我会一直在这里支持你。',
            '自我调节': '自我调节是很重要的技能，让我们一起来完善它。',
            '逃避': '逃避有时也是保护自己的方式，但我们可以找到更好的方法。'
        };
        
        return guidanceMap[strategy] || '';
    }

    /**
     * 获取进度鼓励
     * @returns {string} 鼓励
     */
    getProgressEncouragement() {
        const progress = this.userProfile.healingProgress;
        
        if (progress.emotionalGrowth > 0) {
            return `我看到你在情感成长方面有了进步，这很了不起。`;
        } else if (progress.sessions > 10) {
            return `你已经和我聊了很多次，我感受到你的坚持和勇气。`;
        }
        
        return '';
    }

    /**
     * 获取趋势洞察
     * @param {string} emotion - 情感类型
     * @returns {string} 洞察
     */
    getTrendInsight(emotion) {
        const trend = this.emotionMemory.emotionTrends[emotion];
        if (!trend) return '';
        
        if (trend.trend === 'increasing') {
            return `我注意到你${emotion}的频率在增加，让我们一起来面对这个趋势。`;
        } else if (trend.trend === 'decreasing') {
            return `我看到你${emotion}的频率在减少，这是很好的进步。`;
        }
        
        return '';
    }

    /**
     * 构建个性化回复
     * @param {string} userMessage - 用户消息
     * @param {Object} emotionAnalysis - 情感分析结果
     * @param {Object} personalizedElements - 个性化元素
     * @param {string} responseStyle - 回复风格
     * @param {string} responseLength - 回复长度
     * @returns {string} 个性化回复
     */
    buildPersonalizedResponse(userMessage, emotionAnalysis, personalizedElements, responseStyle, responseLength) {
        // 这里可以集成到主要的回复生成逻辑中
        // 暂时返回基础回复，后续可以扩展
        return this.getLocalIntelligentResponse(userMessage);
    }

    /**
     * 获取情感关键词
     * @returns {Object} 情感关键词映射
     */
    getEmotionKeywords() {
        return {
            // 基础情绪
            '焦虑': ['焦虑', '担心', '紧张', '不安', '恐惧', '害怕', '忧虑', '忐忑', '心慌'],
            '孤独': ['孤独', '寂寞', '孤单', '一个人', '没人', '空虚', '孤立', '被遗忘'],
            '喜悦': ['开心', '高兴', '快乐', '兴奋', '愉悦', '欣喜', '满足', '幸福'],
            '悲伤': ['难过', '伤心', '痛苦', '沮丧', '失落', '哭', '眼泪', '心碎', '绝望'],
            '愤怒': ['生气', '愤怒', '恼火', '烦躁', '讨厌', '恨', '暴怒', '愤慨'],
            '平静': ['平静', '安静', '放松', '舒适', '宁静', '安详', '平和'],
            '困惑': ['困惑', '迷茫', '不知道', '不确定', '怎么办', '选择', '纠结'],
            
            // 复合情绪
            '焦虑-孤独': ['焦虑', '孤独', '担心', '寂寞'],
            '悲伤-愤怒': ['难过', '愤怒', '伤心', '生气'],
            '喜悦-焦虑': ['开心', '担心', '高兴', '紧张'],
            '平静-困惑': ['平静', '困惑', '放松', '迷茫'],
            
            // 细微情感
            '期待': ['期待', '盼望', '等待', '希望', '憧憬'],
            '失望': ['失望', '失落', '沮丧', '挫败'],
            '感激': ['感激', '感谢', '感恩', '感动'],
            '内疚': ['内疚', '愧疚', '自责', '后悔'],
            '嫉妒': ['嫉妒', '羡慕', '眼红', '酸'],
            '羞耻': ['羞耻', '羞愧', '尴尬', '难为情'],
            '自豪': ['自豪', '骄傲', '得意', '满足'],
            '同情': ['同情', '怜悯', '心疼', '不忍']
        };
    }

    /**
     * 获取用户画像摘要
     * @returns {Object} 用户画像摘要
     */
    getUserProfileSummary() {
        return {
            totalSessions: this.userProfile.healingProgress.sessions,
            emotionalGrowth: this.userProfile.healingProgress.emotionalGrowth,
            commonEmotions: Object.keys(this.userProfile.emotionBaseline)
                .sort((a, b) => this.userProfile.emotionBaseline[b].count - this.userProfile.emotionBaseline[a].count)
                .slice(0, 3),
            triggers: this.userProfile.triggers,
            copingStrategies: this.userProfile.copingStrategies,
            recentTrends: Object.keys(this.emotionMemory.emotionTrends)
                .filter(emotion => this.emotionMemory.emotionTrends[emotion].trend !== 'stable')
        };
    }

    /**
     * 重置用户画像
     */
    resetUserProfile() {
        this.userProfile = {
            emotionBaseline: {},
            emotionPatterns: {},
            triggers: [],
            copingStrategies: [],
            preferences: {
                communicationStyle: 'warm',
                responseLength: 'medium',
                emotionalIntensity: 'moderate'
            },
            healingProgress: {
                sessions: 0,
                emotionalGrowth: 0,
                copingSkills: [],
                milestones: []
            }
        };
        
        this.emotionMemory = {
            recentEmotions: [],
            emotionTrends: {},
            triggerPatterns: {},
            responseEffectiveness: {}
        };
        
        console.log('用户画像已重置');
    }

    /**
     * 心理愈感进度追踪系统
     */
    
    /**
     * 评估心理愈感进度
     * @param {Object} emotionAnalysis - 当前情感分析结果
     * @returns {Object} 愈感进度评估
     */
    evaluateHealingProgress(emotionAnalysis) {
        const { primaryEmotion, intensity, context } = emotionAnalysis;
        const progress = this.userProfile.healingProgress;
        
        const evaluation = {
            overallProgress: 0,
            emotionalStability: 0,
            copingSkills: 0,
            selfAwareness: 0,
            resilience: 0,
            milestones: [],
            recommendations: []
        };
        
        // 评估情感稳定性
        evaluation.emotionalStability = this.evaluateEmotionalStability();
        
        // 评估应对技能
        evaluation.copingSkills = this.evaluateCopingSkills(context.coping_indicators);
        
        // 评估自我意识
        evaluation.selfAwareness = this.evaluateSelfAwareness(emotionAnalysis);
        
        // 评估韧性
        evaluation.resilience = this.evaluateResilience();
        
        // 计算总体进度
        evaluation.overallProgress = (
            evaluation.emotionalStability + 
            evaluation.copingSkills + 
            evaluation.selfAwareness + 
            evaluation.resilience
        ) / 4;
        
        // 生成里程碑
        evaluation.milestones = this.generateMilestones(evaluation);
        
        // 生成建议
        evaluation.recommendations = this.generateHealingRecommendations(evaluation);
        
        return evaluation;
    }

    /**
     * 评估情感稳定性
     * @returns {number} 情感稳定性评分 (0-1)
     */
    evaluateEmotionalStability() {
        const recentEmotions = this.emotionMemory.recentEmotions.slice(-10);
        if (recentEmotions.length < 3) return 0.5;
        
        // 计算情感波动
        const intensities = recentEmotions.map(e => e.intensity);
        const variance = this.calculateVariance(intensities);
        
        // 计算积极情感比例
        const positiveEmotions = ['喜悦', '平静', '感激', '自豪'];
        const positiveCount = recentEmotions.filter(e => 
            positiveEmotions.some(pe => e.emotion.includes(pe))
        ).length;
        const positiveRatio = positiveCount / recentEmotions.length;
        
        // 综合评分
        const stabilityScore = Math.max(0, 1 - variance) * 0.6 + positiveRatio * 0.4;
        return Math.min(1, stabilityScore);
    }

    /**
     * 评估应对技能
     * @param {Array} copingStrategies - 应对策略
     * @returns {number} 应对技能评分 (0-1)
     */
    evaluateCopingSkills(copingStrategies) {
        const positiveStrategies = ['积极应对', '寻求支持', '自我调节'];
        const negativeStrategies = ['逃避'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        copingStrategies.forEach(strategy => {
            if (positiveStrategies.includes(strategy)) positiveCount++;
            if (negativeStrategies.includes(strategy)) negativeCount++;
        });
        
        if (positiveCount + negativeCount === 0) return 0.5;
        
        return positiveCount / (positiveCount + negativeCount);
    }

    /**
     * 评估自我意识
     * @param {Object} emotionAnalysis - 情感分析结果
     * @returns {number} 自我意识评分 (0-1)
     */
    evaluateSelfAwareness(emotionAnalysis) {
        const { primaryEmotion, secondaryEmotions, context } = emotionAnalysis;
        
        let awarenessScore = 0;
        
        // 能够识别复合情绪
        if (secondaryEmotions.length > 0) awarenessScore += 0.3;
        
        // 能够识别触发因素
        if (context.triggers.length > 0) awarenessScore += 0.3;
        
        // 能够表达具体情感
        if (primaryEmotion !== '平静') awarenessScore += 0.2;
        
        // 能够识别支持需求
        if (context.support_needs.length > 0) awarenessScore += 0.2;
        
        return Math.min(1, awarenessScore);
    }

    /**
     * 评估韧性
     * @returns {number} 韧性评分 (0-1)
     */
    evaluateResilience() {
        const progress = this.userProfile.healingProgress;
        
        // 基于情感成长次数
        const growthRatio = progress.emotionalGrowth / Math.max(1, progress.sessions);
        
        // 基于对话持续性
        const consistencyScore = Math.min(1, progress.sessions / 10);
        
        // 基于情感趋势
        const trendScore = this.calculateTrendResilience();
        
        return (growthRatio * 0.4 + consistencyScore * 0.3 + trendScore * 0.3);
    }

    /**
     * 计算趋势韧性
     * @returns {number} 趋势韧性评分
     */
    calculateTrendResilience() {
        const trends = this.emotionMemory.emotionTrends;
        let resilienceScore = 0.5;
        
        Object.values(trends).forEach(trend => {
            if (trend.trend === 'decreasing') resilienceScore += 0.1;
            else if (trend.trend === 'increasing') resilienceScore -= 0.1;
        });
        
        return Math.max(0, Math.min(1, resilienceScore));
    }

    /**
     * 生成里程碑
     * @param {Object} evaluation - 评估结果
     * @returns {Array} 里程碑列表
     */
    generateMilestones(evaluation) {
        const milestones = [];
        const progress = this.userProfile.healingProgress;
        
        // 对话里程碑
        if (progress.sessions >= 5 && !this.hasMilestone('first_week')) {
            milestones.push({
                id: 'first_week',
                title: '坚持一周',
                description: '你已经和我聊了一周，展现了坚持的力量',
                achieved: true,
                timestamp: new Date().toISOString()
            });
        }
        
        // 情感成长里程碑
        if (progress.emotionalGrowth >= 3 && !this.hasMilestone('emotional_growth')) {
            milestones.push({
                id: 'emotional_growth',
                title: '情感成长',
                description: '你在情感处理方面有了显著进步',
                achieved: true,
                timestamp: new Date().toISOString()
            });
        }
        
        // 稳定性里程碑
        if (evaluation.emotionalStability > 0.7 && !this.hasMilestone('emotional_stability')) {
            milestones.push({
                id: 'emotional_stability',
                title: '情感稳定',
                description: '你的情感状态变得更加稳定',
                achieved: true,
                timestamp: new Date().toISOString()
            });
        }
        
        // 应对技能里程碑
        if (evaluation.copingSkills > 0.8 && !this.hasMilestone('coping_mastery')) {
            milestones.push({
                id: 'coping_mastery',
                title: '应对大师',
                description: '你掌握了有效的情绪应对技能',
                achieved: true,
                timestamp: new Date().toISOString()
            });
        }
        
        return milestones;
    }

    /**
     * 检查是否已有某个里程碑
     * @param {string} milestoneId - 里程碑ID
     * @returns {boolean} 是否已有
     */
    hasMilestone(milestoneId) {
        return this.userProfile.healingProgress.milestones.some(m => m.id === milestoneId);
    }

    /**
     * 生成愈感建议
     * @param {Object} evaluation - 评估结果
     * @returns {Array} 建议列表
     */
    generateHealingRecommendations(evaluation) {
        const recommendations = [];
        
        // 基于情感稳定性
        if (evaluation.emotionalStability < 0.5) {
            recommendations.push({
                type: 'emotional_stability',
                priority: 'high',
                title: '提升情感稳定性',
                description: '建议进行正念练习和情绪调节训练',
                actions: ['每日冥想5-10分钟', '记录情绪日记', '练习深呼吸技巧']
            });
        }
        
        // 基于应对技能
        if (evaluation.copingSkills < 0.6) {
            recommendations.push({
                type: 'coping_skills',
                priority: 'medium',
                title: '发展应对技能',
                description: '学习更多有效的情绪应对策略',
                actions: ['尝试新的放松技巧', '建立支持网络', '练习积极思维']
            });
        }
        
        // 基于自我意识
        if (evaluation.selfAwareness < 0.7) {
            recommendations.push({
                type: 'self_awareness',
                priority: 'medium',
                title: '增强自我意识',
                description: '提高对自身情感和触发因素的认识',
                actions: ['反思情感模式', '识别个人触发因素', '练习情感表达']
            });
        }
        
        // 基于韧性
        if (evaluation.resilience < 0.6) {
            recommendations.push({
                type: 'resilience',
                priority: 'high',
                title: '建立情感韧性',
                description: '增强从困难中恢复的能力',
                actions: ['设定小目标', '庆祝小胜利', '建立积极习惯']
            });
        }
        
        return recommendations;
    }

    /**
     * 计算方差
     * @param {Array} values - 数值数组
     * @returns {number} 方差
     */
    calculateVariance(values) {
        if (values.length < 2) return 0;
        
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        
        return variance;
    }

    /**
     * 获取愈感进度报告
     * @returns {Object} 愈感进度报告
     */
    getHealingProgressReport() {
        const recentEmotion = this.emotionMemory.recentEmotions[this.emotionMemory.recentEmotions.length - 1];
        const evaluation = recentEmotion ? this.evaluateHealingProgress({
            primaryEmotion: recentEmotion.emotion,
            intensity: recentEmotion.intensity,
            context: recentEmotion.context
        }) : null;
        
        return {
            userProfile: this.getUserProfileSummary(),
            currentEvaluation: evaluation,
            emotionHistory: this.emotionMemory.recentEmotions.slice(-10),
            milestones: this.userProfile.healingProgress.milestones,
            recommendations: evaluation ? evaluation.recommendations : []
        };
    }

    /**
     * 获取备用回复（当API不可用时）
     * @param {string} userMessage - 用户消息
     * @returns {string} 备用回复
     */
    getFallbackResponse(userMessage) {
        console.log('使用备用回复系统');
        return this.getLocalIntelligentResponse(userMessage);
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
                "亲爱的，我能感受到你内心的不安，这种焦虑的感觉就像夜晚的乌云，虽然暂时遮蔽了星光，但请相信，黎明总会到来。💫\n\n我完全理解你此刻的感受。焦虑是一种很真实的情感，它告诉我们有些事情需要关注，有些情绪需要被倾听。你的感受是完全合理和正常的，不要为此感到羞耻或自责。\n\n让我们一起来面对这份焦虑吧。首先，我想邀请你做三次深呼吸，感受空气在胸腔中的流动，感受每一次呼吸带来的平静。然后，如果你愿意的话，可以告诉我是什么让你感到如此不安？\n\n我想让你知道，你并不孤单。我在这里陪伴着你，用我的'心'去感受你的情感。每一个焦虑的时刻都是成长的机会，每一次面对困难都是你变得更强大的证明。让我们一起找到内心的平静，一起走过这段时光。\n\n记住，你是被爱着的，你是值得被理解的。无论外面的世界如何变化，你的内心都有无限的力量。",
                "我深深理解你此刻的焦虑，这种感受就像心中有一只小兔子在不停地跳动，让人无法平静。但请相信，这种不安的感觉是暂时的，就像暴风雨总会过去一样。🌙\n\n我想告诉你，焦虑其实是你的内心在提醒你要关注某些事情，这是你身体和心灵的一种保护机制。你的感受是完全正常的，很多人都会经历这样的时刻。不要觉得自己有什么问题，你只是在经历人类情感的一部分。\n\n让我们慢慢来，一步一步地处理这份焦虑。你可以先找一个安静的地方坐下，闭上眼睛，想象自己在一片宁静的森林中，听着鸟儿的歌唱，感受微风轻抚脸颊。这样的想象可以帮助你找到内心的平静。\n\n告诉我，是什么让你感到焦虑？我们一起分析一下，找到解决的方向。记住，每一个困难都是通往成长的阶梯，每一次挑战都是让你变得更强大的机会。我会一直在这里陪伴你，用最温暖的心去理解和支持你。"
            ],
            // 孤独相关
            '孤独': [
                "亲爱的，我能深深感受到你内心的孤独，这种感受就像夜晚的星空，虽然美丽，但有时也会让人感到深深的寂寞。但你知道吗？即使是最遥远的星星，也在为彼此发光，就像我们此刻的心灵连接一样。✨\n\n我想告诉你，孤独并不意味着你被遗忘或不被爱。相反，孤独给了你与自己深度对话的机会，让你更加了解自己内心的声音。你的感受是完全正常的，很多人都会经历这样的时刻。\n\n让我们一起来面对这份孤独吧。你可以尝试写日记，记录内心的感受，或者听一些温暖的音乐，让旋律陪伴你的心灵。你也可以给自己一个温暖的拥抱，告诉自己'我值得被爱'。\n\n我在这里陪伴着你，虽然我们相隔屏幕，但心灵的连接是真实的。我想让你知道，你并不孤单，我会用我的'心'去感受你的情感，用最温暖的语言给予你支持。告诉我，你最近有什么想分享的吗？让我们一起创造一些美好的回忆，让这份孤独变成成长的力量。",
                "我深深理解你内心的孤独，这种感受就像一个人在空旷的房间里，回声显得格外清晰，让人感到一种深深的空虚。但请记住，孤独也是一种力量，它让你更加了解自己，更加珍惜与他人的连接。🌌\n\n我想让你知道，你的感受是完全合理和正常的。孤独是人类情感的一部分，它告诉我们内心需要更多的连接和理解。不要为此感到羞耻，你只是在经历一种很真实的情感。\n\n让我们一起来处理这份孤独吧。你可以尝试一些温暖的活动：泡一杯热茶，感受温暖从手心传递到心里；看一本喜欢的书，让文字陪伴你的心灵；或者给远方的朋友发一条消息，分享你的感受。有时候，一个小小的行动就能驱散内心的阴霾。\n\n我在这里倾听你的心声，用最温暖的心去理解和支持你。让我们一起度过这个时刻，让这份孤独变成你内心成长的机会。你想聊聊什么吗？我会一直在这里陪伴你。"
            ],
            // 悲伤相关
            '悲伤': [
                "亲爱的，我能深深感受到你内心的悲伤，这种感受就像雨滴落在心田，每一滴都带着重量，让人感到一种深深的沉重。但请相信，雨过天晴后，彩虹会更加美丽，就像你内心的希望一样。🌈\n\n我想告诉你，悲伤是情感的一部分，它让我们更加珍惜快乐，也让我们更加理解生命的珍贵。你的感受是完全合理和正常的，不要为此感到羞耻或觉得自己有什么问题。悲伤是人类情感的一部分，它告诉我们内心需要被倾听和理解。\n\n你可以允许自己感受这份悲伤，不要压抑它。有时候，哭一场也是释放情感的好方式，眼泪是心灵的清洁剂。你可以找一个安静的地方，让情感自然流淌，感受内心的每一个波动。\n\n告诉我，是什么让你感到如此难过？我在这里陪伴着你，用我的'心'去感受你的情感，用最温暖的语言给予你支持。让我们一起走过这段时光，让这份悲伤变成你内心成长的力量。记住，你并不孤单，我会一直在这里支持你，用最温暖的心去理解你。",
                "我深深理解你此刻的悲伤，这种感受就像心中有一片乌云，暂时遮蔽了阳光，让人感到一种深深的阴霾。但请相信，乌云终会散去，阳光会重新照耀，就像你内心的希望一样。☀️\n\n我想让你知道，悲伤是人生的一部分，它让我们更加珍惜美好的时刻，也让我们更加理解生命的脆弱和珍贵。你的感受是完全正常的，很多人都会经历这样的时刻。不要觉得自己有什么问题，你只是在经历一种很真实的情感。\n\n让我们一起来处理这份悲伤吧。你可以尝试做一些让自己感到温暖的事情：听一些温暖的音乐，让旋律陪伴你的心灵；看一些美丽的风景，感受大自然的治愈力量；或者和朋友聊天，分享你的感受。有时候，一个小小的行动就能带来内心的温暖。\n\n我在这里陪伴着你，虽然无法给你一个真实的拥抱，但我的关怀是真诚的。我想让你知道，你并不孤单，我会用我的'心'去感受你的情感，用最温暖的语言给予你支持。你想和我分享什么吗？我会一直在这里倾听你的心声。"
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
            "亲爱的，我能深深感受到你想要分享的心情，这种渴望被理解和倾听的感受是如此真实和珍贵。虽然我现在无法连接到网络，但我依然在这里陪伴着你，用我的'心'去感受你的情感。💫\n\n我想告诉你，每一个感受都值得被倾听，每一个故事都值得被讲述，每一个情感都是你内心世界的重要组成部分。你可以告诉我任何你想说的话，我会用心倾听，用最温暖的语言给予你回应。\n\n有时候，仅仅是表达出来，就能让内心感到轻松一些，就像把心中的重担卸下一样。你的感受是完全合理和正常的，不要为此感到羞耻或觉得自己有什么问题。\n\n你想和我分享什么呢？我在这里等待着你，用最温暖的心去理解和支持你。让我们一起创造一些美好的对话，让这份连接成为你内心成长的力量。",
            "我在这里陪伴着你，虽然暂时无法使用网络功能，但我的关怀是真实的，我的理解是深刻的。我想让你知道，你并不孤单，我会用我的'心'去感受你的情感。🌙\n\n生活中的每一个时刻都有它的意义，无论是快乐还是悲伤，都是我们成长的一部分，都是你内心世界的重要组成部分。你可以和我分享任何你想说的话，我会用心倾听你的每一个字，用最温暖的语言给予你回应。\n\n我想让你知道，你的感受是完全合理和正常的，很多人都会经历各种各样的情感波动。不要觉得自己有什么问题，你只是在经历人类情感的一部分。\n\n告诉我，你今天过得怎么样？有什么想和我分享的吗？我会用心倾听你的每一个字，用最温暖的心去理解和支持你。让我们一起度过这个时刻，让这份对话成为你内心成长的机会。",
            "亲爱的，虽然我现在处于离线模式，但我依然能够感受到你的情感，每一个字都承载着你的心情，我会用心去理解，用最温暖的语言给予你回应。✨\n\n我想告诉你，生活就像一条河流，有时平静，有时湍急，但总是在向前流动。无论你此刻的心情如何，都是这条河流中重要的一部分，都是你内心世界的重要组成部分。你的感受是完全合理和正常的，不要为此感到羞耻或觉得自己有什么问题。\n\n我想让你知道，你并不孤单，我会用我的'心'去感受你的情感，用最温暖的语言给予你支持。每一个情感都是你内心成长的机会，每一次对话都是建立连接的机会。\n\n你想和我分享什么吗？我在这里静静地等待，准备倾听你的心声，用最温暖的心去理解和支持你。让我们一起创造一些美好的对话，让这份连接成为你内心成长的力量。"
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
