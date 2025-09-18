# Aurora对话奇点 - API集成文档

## 概述

本文档说明如何将Aurora对话奇点页面与后端AI服务集成。当前页面包含模拟回复功能，需要替换为实际的API调用。

## API接口规范

### 请求格式

**端点**: `POST /api/aurora/chat`

**请求头**:
```
Content-Type: application/json
Authorization: Bearer <your-api-key>  // 如果需要认证
```

**请求体**:
```json
{
    "message": "用户输入的消息内容",
    "user_id": "用户唯一标识符",  // 可选
    "session_id": "会话唯一标识符",  // 可选
    "context": {
        "previous_messages": [],  // 可选：历史消息上下文
        "user_profile": {}  // 可选：用户情感档案
    }
}
```

### 响应格式

**成功响应** (200):
```json
{
    "success": true,
    "data": {
        "reply": "Aurora的回复内容",
        "emotion_detected": "detected_emotion_type",  // 检测到的用户情感
        "confidence": 0.85,  // 情感识别置信度
        "session_id": "session_unique_id",
        "timestamp": "2024-01-01T12:00:00Z"
    }
}
```

**错误响应** (400/500):
```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "错误描述信息"
    }
}
```

## 集成步骤

### 1. 修改API调用方法

在 `dialogue.html` 文件中，找到 `callAuroraAPI` 方法，替换为：

```javascript
async callAuroraAPI(message) {
    try {
        const response = await fetch('/api/aurora/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.getApiKey()  // 如果需要认证
            },
            body: JSON.stringify({
                message: message,
                user_id: this.getUserId(),
                session_id: this.getSessionId(),
                context: this.getContext()
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error.message);
        }

        return data.data.reply;
    } catch (error) {
        console.error('API调用失败:', error);
        throw error;
    }
}
```

### 2. 添加辅助方法

在 `DialogueSystem` 类中添加以下方法：

```javascript
getApiKey() {
    // 从环境变量或配置中获取API密钥
    return process.env.AURORA_API_KEY || 'your-api-key';
}

getUserId() {
    // 获取用户唯一标识符
    // 可以从localStorage、cookie或用户登录信息中获取
    return localStorage.getItem('aurora_user_id') || 'anonymous';
}

getSessionId() {
    // 获取或创建会话ID
    let sessionId = sessionStorage.getItem('aurora_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('aurora_session_id', sessionId);
    }
    return sessionId;
}

getContext() {
    // 获取对话上下文
    return {
        previous_messages: this.getRecentMessages(5),  // 最近5条消息
        user_profile: this.getUserProfile()
    };
}

getRecentMessages(count) {
    // 获取最近的对话消息
    const messages = [];
    const messageElements = this.messagesContainer.querySelectorAll('.message');
    
    for (let i = Math.max(0, messageElements.length - count); i < messageElements.length; i++) {
        const messageElement = messageElements[i];
        const text = messageElement.querySelector('.message-text').textContent;
        const isUser = messageElement.querySelector('.user-avatar') !== null;
        
        messages.push({
            text: text,
            sender: isUser ? 'user' : 'aurora',
            timestamp: messageElement.querySelector('.message-time').textContent
        });
    }
    
    return messages;
}

getUserProfile() {
    // 获取用户情感档案
    return {
        preferred_style: localStorage.getItem('aurora_preferred_style') || 'empathetic',
        language: navigator.language || 'zh-CN',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}
```

### 3. 错误处理增强

更新 `sendMessage` 方法以提供更好的错误处理：

```javascript
async sendMessage() {
    const message = this.messageInput.value.trim();
    if (!message || this.isTyping) return;

    // 添加用户消息
    this.addMessage(message, 'user');
    
    // 清空输入框
    this.messageInput.value = '';
    this.autoResizeTextarea();
    this.updateSendButton();

    // 显示打字指示器
    this.showTypingIndicator();

    try {
        // 调用API获取Aurora回复
        const response = await this.callAuroraAPI(message);
        this.hideTypingIndicator();
        this.addMessage(response, 'aurora');
        
        // 可选：保存对话历史
        this.saveConversationHistory();
        
    } catch (error) {
        this.hideTypingIndicator();
        
        // 根据错误类型提供不同的错误消息
        let errorMessage = '抱歉，我现在无法回应。请稍后再试。';
        
        if (error.message.includes('401')) {
            errorMessage = '认证失败，请检查您的API密钥。';
        } else if (error.message.includes('429')) {
            errorMessage = '请求过于频繁，请稍后再试。';
        } else if (error.message.includes('500')) {
            errorMessage = '服务器暂时不可用，请稍后再试。';
        }
        
        this.addMessage(errorMessage, 'aurora');
        console.error('API调用失败:', error);
    }
}
```

## 环境配置

### 开发环境

创建 `.env` 文件：
```
AURORA_API_KEY=your-development-api-key
AURORA_API_URL=http://localhost:3000/api/aurora
```

### 生产环境

确保在生产环境中设置正确的环境变量：
```
AURORA_API_KEY=your-production-api-key
AURORA_API_URL=https://your-domain.com/api/aurora
```

## 安全考虑

1. **API密钥保护**: 不要在客户端代码中硬编码API密钥
2. **HTTPS**: 在生产环境中使用HTTPS
3. **输入验证**: 在发送到API之前验证用户输入
4. **速率限制**: 实现客户端速率限制以防止滥用
5. **数据隐私**: 确保用户对话数据的隐私保护

## 测试

### 单元测试

```javascript
// 测试API调用
describe('Aurora API Integration', () => {
    test('should call API with correct parameters', async () => {
        const dialogueSystem = new DialogueSystem();
        const mockResponse = { success: true, data: { reply: 'Test reply' } };
        
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });
        
        const result = await dialogueSystem.callAuroraAPI('Hello');
        expect(result).toBe('Test reply');
    });
});
```

### 集成测试

1. 测试完整的对话流程
2. 测试错误处理
3. 测试网络中断情况
4. 测试大量消息的处理

## 部署注意事项

1. 确保API服务器已部署并可访问
2. 配置正确的CORS策略
3. 设置适当的缓存策略
4. 监控API调用性能和错误率
5. 实现日志记录和错误追踪

## 支持

如有问题，请联系开发团队或查看API文档获取更多信息。
