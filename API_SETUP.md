# Aurora AI API 配置指南

## 🚀 快速开始

### 1. 设置您的AI API

在浏览器控制台中运行以下代码来设置您的API：

```javascript
// 设置您的AI API配置
window.auroraChat.setApiConfig({
    apiKey: '您的API密钥',
    apiUrl: '您的API端点URL',
    model: '您的模型名称'
});
```

### 2. 示例配置

```javascript
// 示例：假设您的API配置如下
window.auroraChat.setApiConfig({
    apiKey: 'sk-1234567890abcdef',
    apiUrl: 'https://api.your-ai-service.com/v1/chat',
    model: 'aurora-custom-model'
});
```

### 3. 验证配置

```javascript
// 检查API状态
console.log(window.auroraAPI.getStatus());
```

## 📋 API要求

您的AI API需要支持以下格式：

### 请求格式
```json
{
    "message": "用户消息",
    "sessionId": "会话ID",
    "history": [
        {
            "user": "之前的用户消息",
            "assistant": "之前的AI回复"
        }
    ],
    "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 响应格式
```json
{
    "reply": "AI的回复内容"
}
```

或者支持以下字段名：
- `response`
- `content` 
- `message`

## 🔧 自定义配置

### 修改请求头
如果需要自定义请求头，可以修改 `js/aurora-api.js` 文件中的 `sendMessage` 方法：

```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.apiKey}`,
    'X-Model': this.model,
    // 添加您的自定义请求头
    'X-Custom-Header': 'your-value'
}
```

### 修改请求数据格式
如果需要不同的请求格式，可以修改 `requestData` 对象：

```javascript
const requestData = {
    // 您的自定义格式
    prompt: message,
    context: this.conversationHistory,
    // ... 其他字段
};
```

## 🎯 功能特性

- ✅ **对话历史管理** - 自动管理对话上下文
- ✅ **会话ID** - 每个对话会话都有唯一ID
- ✅ **错误处理** - 完善的错误处理和重试机制
- ✅ **响应式设计** - 支持手机和电脑
- ✅ **打字指示器** - 显示AI正在思考
- ✅ **消息保存** - 所有对话都会保存在页面上

## 🚨 故障排除

### 常见问题

1. **API未配置**
   - 确保已调用 `setApiConfig()` 方法
   - 检查API密钥和端点是否正确

2. **网络错误**
   - 检查API端点是否可访问
   - 确认CORS设置是否正确

3. **响应格式错误**
   - 确保API返回的JSON包含 `reply` 字段
   - 检查响应状态码是否为200

### 调试方法

```javascript
// 启用详细日志
console.log('API状态:', window.auroraAPI.getStatus());
console.log('对话历史:', window.auroraAPI.getHistory());

// 测试API连接
window.auroraAPI.sendMessage('测试消息')
    .then(response => console.log('API响应:', response))
    .catch(error => console.error('API错误:', error));
```

## 📞 技术支持

如果您在配置过程中遇到问题，请：

1. 检查浏览器控制台的错误信息
2. 确认API端点格式正确
3. 验证API密钥有效性
4. 测试API端点是否可访问

---

**注意**: 请妥善保管您的API密钥，不要在前端代码中硬编码敏感信息。
