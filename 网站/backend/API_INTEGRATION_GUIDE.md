# Aurora后端API集成指南

## 概述

本指南将帮助您将Aurora前端页面与后端API服务进行集成。Aurora后端采用微服务架构，提供RESTful API接口。

## 快速开始

### 1. 启动后端服务

```bash
# 开发环境
./deploy.sh dev

# 生产环境
./deploy.sh prod
```

### 2. 验证服务状态

```bash
# 检查服务健康状态
curl http://localhost:3000/health

# 查看API文档
open http://localhost:3000/api-docs
```

## API端点

### 基础URL
- **开发环境**: `http://localhost:3000/api/v1`
- **生产环境**: `https://your-domain.com/api/v1`

### 认证接口

#### 用户注册
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### 用户登录
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "role": "user"
    },
    "tokens": {
      "accessToken": "jwt_token_here",
      "refreshToken": "refresh_token_here",
      "expiresIn": "24h"
    }
  }
}
```

### 情感分析接口

#### 情感分析
```http
POST /api/v1/emotion/analyze
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text": "我今天心情很好，工作很顺利",
  "context": {
    "previousMessages": [
      {"role": "user", "content": "你好"},
      {"role": "aurora", "content": "你好，有什么可以帮助你的吗？"}
    ],
    "userProfile": {
      "preferredStyle": "calm"
    }
  }
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "emotion": "joy",
    "intensity": 0.85,
    "confidence": 0.92,
    "reasoning": "检测到积极词汇和正面情绪表达",
    "secondaryEmotions": [
      {
        "emotion": "contentment",
        "intensity": 0.7,
        "confidence": 0.8
      }
    ],
    "metadata": {
      "textLength": 12,
      "hasContext": true,
      "analysisTimestamp": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### 情感对话
```http
POST /api/v1/emotion/chat
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "message": "我今天工作压力很大",
  "sessionId": "session_123456"
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "reply": "我理解你现在的压力，让我们一起面对这个问题。首先，你能告诉我具体是什么让你感到压力吗？",
    "emotionDetected": "stress",
    "confidence": 0.88,
    "suggestions": [
      "尝试深呼吸练习",
      "分解任务优先级",
      "寻求同事支持"
    ],
    "metadata": {
      "replyLength": 45,
      "processingTime": 1.2
    }
  }
}
```

#### 情感导航
```http
POST /api/v1/emotion/navigate
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentEmotion": "anxiety",
  "targetEmotion": "calm",
  "preferences": {
    "duration": "short",
    "method": "breathing",
    "difficulty": "easy"
  }
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "path": [
      {
        "step": 1,
        "action": "breathing_exercise",
        "description": "进行5分钟深呼吸练习",
        "duration": 5,
        "difficulty": "easy"
      },
      {
        "step": 2,
        "action": "mindfulness",
        "description": "进行正念冥想",
        "duration": 10,
        "difficulty": "medium"
      }
    ],
    "estimatedTime": 15,
    "difficulty": "medium",
    "tips": [
      "找一个安静的环境",
      "关闭手机通知",
      "专注于呼吸节奏"
    ]
  }
}
```

## 前端集成

### 1. 更新对话页面

修改 `dialogue.html` 中的 `callAuroraAPI` 方法：

```javascript
async callAuroraAPI(message) {
    try {
        const response = await fetch('http://localhost:3000/api/v1/emotion/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}` // 需要实现获取token的方法
            },
            body: JSON.stringify({
                message: message,
                sessionId: this.sessionId,
                userId: this.userId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            return {
                reply: data.data.reply,
                emotion: data.data.emotionDetected || 'neutral'
            };
        } else {
            throw new Error(data.message || 'API returned an error.');
        }
    } catch (error) {
        console.error("Error calling Aurora API:", error);
        return {
            reply: "抱歉，Aurora暂时无法连接。请稍后再试。",
            emotion: "sadness"
        };
    }
}
```

### 2. 添加认证管理

创建认证管理器：

```javascript
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('aurora_token');
        this.refreshToken = localStorage.getItem('aurora_refresh_token');
    }

    async login(email, password) {
        try {
            const response = await fetch('http://localhost:3000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (data.success) {
                this.token = data.data.tokens.accessToken;
                this.refreshToken = data.data.tokens.refreshToken;
                
                localStorage.setItem('aurora_token', this.token);
                localStorage.setItem('aurora_refresh_token', this.refreshToken);
                
                return data.data.user;
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async refreshAccessToken() {
        try {
            const response = await fetch('http://localhost:3000/api/v1/auth/refresh', {
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
                return this.token;
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.logout();
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('aurora_token');
        localStorage.removeItem('aurora_refresh_token');
    }

    getAuthToken() {
        return this.token;
    }

    isAuthenticated() {
        return !!this.token;
    }
}
```

### 3. 错误处理

添加全局错误处理：

```javascript
class ErrorHandler {
    static handleAPIError(error, response) {
        if (response?.status === 401) {
            // 认证失败，尝试刷新token
            return this.handleAuthError();
        } else if (response?.status === 429) {
            // 请求过于频繁
            return {
                type: 'rate_limit',
                message: '请求过于频繁，请稍后再试',
                retryAfter: response.headers.get('Retry-After')
            };
        } else if (response?.status >= 500) {
            // 服务器错误
            return {
                type: 'server_error',
                message: '服务器暂时不可用，请稍后再试'
            };
        } else {
            // 其他错误
            return {
                type: 'client_error',
                message: error.message || '请求失败'
            };
        }
    }

    static async handleAuthError() {
        const authManager = new AuthManager();
        try {
            await authManager.refreshAccessToken();
            return { type: 'retry', message: '认证已刷新，请重试' };
        } catch (error) {
            authManager.logout();
            return { type: 'auth_failed', message: '认证失败，请重新登录' };
        }
    }
}
```

## 环境配置

### 开发环境

创建 `.env.local` 文件：

```env
# API配置
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3001

# 认证配置
VITE_AUTH_ENABLED=true
VITE_TOKEN_STORAGE_KEY=aurora_token
```

### 生产环境

```env
# API配置
VITE_API_BASE_URL=https://api.aurora.ai/api/v1
VITE_WS_URL=wss://api.aurora.ai

# 认证配置
VITE_AUTH_ENABLED=true
VITE_TOKEN_STORAGE_KEY=aurora_token
```

## 测试

### 1. 单元测试

```javascript
// 测试情感分析API
describe('Emotion API', () => {
    test('should analyze emotion correctly', async () => {
        const response = await fetch('/api/v1/emotion/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${testToken}`
            },
            body: JSON.stringify({
                text: '我今天心情很好'
            })
        });

        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.data.emotion).toBe('joy');
        expect(data.data.confidence).toBeGreaterThan(0.5);
    });
});
```

### 2. 集成测试

```javascript
// 测试完整对话流程
describe('Chat Integration', () => {
    test('should complete chat flow', async () => {
        // 1. 登录
        const loginResponse = await authManager.login('test@example.com', 'password');
        expect(loginResponse).toBeDefined();

        // 2. 开始对话
        const chatResponse = await fetch('/api/v1/emotion/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authManager.getAuthToken()}`
            },
            body: JSON.stringify({
                message: '你好，Aurora',
                sessionId: 'test_session'
            })
        });

        const chatData = await chatResponse.json();
        expect(chatData.success).toBe(true);
        expect(chatData.data.reply).toBeDefined();
    });
});
```

## 部署

### 1. Docker部署

```bash
# 构建镜像
docker build -t aurora-frontend .

# 运行容器
docker run -p 3000:3000 \
  -e VITE_API_BASE_URL=https://api.aurora.ai/api/v1 \
  aurora-frontend
```

### 2. Nginx配置

```nginx
server {
    listen 80;
    server_name aurora.ai;

    location / {
        root /var/www/aurora-frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 监控和日志

### 1. 错误监控

```javascript
// 集成Sentry错误监控
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: process.env.NODE_ENV
});

// 在API调用中添加错误捕获
try {
    const response = await fetch('/api/v1/emotion/chat', options);
    // ...
} catch (error) {
    Sentry.captureException(error);
    throw error;
}
```

### 2. 性能监控

```javascript
// 添加性能监控
const startTime = performance.now();
const response = await fetch('/api/v1/emotion/chat', options);
const endTime = performance.now();

console.log(`API调用耗时: ${endTime - startTime}ms`);

// 发送到监控服务
analytics.track('api_call_duration', {
    endpoint: '/api/v1/emotion/chat',
    duration: endTime - startTime
});
```

## 安全考虑

### 1. HTTPS

确保生产环境使用HTTPS：

```javascript
// 检查协议
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

### 2. Token安全

```javascript
// 安全的token存储
class SecureTokenStorage {
    static setToken(token) {
        // 使用httpOnly cookie或加密存储
        const encryptedToken = this.encrypt(token);
        localStorage.setItem('aurora_token', encryptedToken);
    }

    static getToken() {
        const encryptedToken = localStorage.getItem('aurora_token');
        return encryptedToken ? this.decrypt(encryptedToken) : null;
    }

    static encrypt(text) {
        // 实现加密逻辑
        return btoa(text); // 简单示例，实际应使用更强的加密
    }

    static decrypt(encryptedText) {
        // 实现解密逻辑
        return atob(encryptedText); // 简单示例
    }
}
```

## 故障排除

### 常见问题

1. **CORS错误**
   - 检查后端CORS配置
   - 确保前端域名在允许列表中

2. **认证失败**
   - 检查token是否过期
   - 验证token格式是否正确

3. **API超时**
   - 增加请求超时时间
   - 检查网络连接

4. **数据格式错误**
   - 验证请求体格式
   - 检查必需字段

### 调试工具

```javascript
// API调试工具
class APIDebugger {
    static logRequest(url, options) {
        console.group('🚀 API Request');
        console.log('URL:', url);
        console.log('Method:', options.method);
        console.log('Headers:', options.headers);
        console.log('Body:', options.body);
        console.groupEnd();
    }

    static logResponse(response, data) {
        console.group('📥 API Response');
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Data:', data);
        console.groupEnd();
    }
}
```

## 支持

如果您在集成过程中遇到问题，请：

1. 查看API文档：`http://localhost:3000/api-docs`
2. 检查服务日志：`docker-compose logs -f`
3. 提交Issue到项目仓库

---

**祝您集成顺利！** 🚀
