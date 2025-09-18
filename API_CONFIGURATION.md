# API配置说明

## 🔑 设置您的DeepSeek API密钥

### 步骤1：获取API密钥
1. 访问 [DeepSeek平台](https://platform.deepseek.com/api_keys)
2. 注册或登录您的账户
3. 创建新的API密钥
4. 复制密钥（格式：`sk-...`）

### 步骤2：配置API密钥
打开文件：`js/deepseek-api.js`

找到第9行：
```javascript
this.apiKey = 'sk-your-actual-deepseek-api-key'; // 请替换为您的真实API密钥
```

将 `'sk-your-actual-deepseek-api-key'` 替换为您的真实API密钥：
```javascript
this.apiKey = 'sk-您的真实API密钥'; // 您的DeepSeek API密钥
```

### 步骤3：保存文件
保存 `js/deepseek-api.js` 文件，API密钥就配置完成了。

## ✅ 验证配置

配置完成后，您可以：

1. **直接使用对话页面**：访问 `dialogue.html`，直接开始与Aurora对话
2. **使用测试页面**：访问 `test-deepseek.html` 验证API连接状态

## 🔒 安全说明

- API密钥已直接集成到代码中，所有用户将使用您的API
- 请妥善保管您的API密钥，不要泄露给他人
- 建议定期检查API使用情况和费用

## 🚀 开始使用

配置完成后，所有用户都可以：
- 直接访问对话页面开始与Aurora对话
- 享受专业的情感疗愈AI服务
- 无需任何额外设置或配置

---

**注意**：请确保您的DeepSeek账户有足够的使用额度来支持所有用户的使用。
