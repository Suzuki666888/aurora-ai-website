# DeepSeek API 连接问题排查指南

## 🔍 问题诊断结果

经过测试，您的DeepSeek API配置是**完全正常**的：

✅ **网络连接正常** - 可以访问 `https://api.deepseek.com`  
✅ **API密钥有效** - `sk-5786e431682e4229a2e63994d4968f15`  
✅ **模型可用** - `deepseek-chat` 和 `deepseek-reasoner`  
✅ **对话功能正常** - 可以成功发送和接收消息  

## 🚨 可能的问题原因

### 1. **浏览器跨域问题 (CORS)**
这是最常见的问题。浏览器可能阻止了跨域请求。

**解决方案：**
- 使用本地服务器运行您的网页
- 或者通过代理服务器访问API

### 2. **浏览器控制台错误**
检查浏览器开发者工具的控制台是否有错误信息。

**检查方法：**
1. 按 `F12` 打开开发者工具
2. 切换到 `Console` 标签
3. 查看是否有红色错误信息

### 3. **网络环境限制**
某些网络环境可能阻止了对DeepSeek API的访问。

**解决方案：**
- 尝试使用不同的网络（如手机热点）
- 检查防火墙设置
- 尝试使用VPN

### 4. **API调用频率限制**
如果短时间内发送太多请求，可能触发了频率限制。

**解决方案：**
- 等待一段时间后重试
- 减少请求频率

## 🛠️ 解决步骤

### 步骤1: 使用诊断工具
我已经为您创建了一个诊断工具 `deepseek-diagnostic.html`，请：

1. 在浏览器中打开该文件
2. 按照提示进行各项测试
3. 查看详细的错误日志

### 步骤2: 检查浏览器控制台
1. 打开您的Aurora对话页面
2. 按 `F12` 打开开发者工具
3. 切换到 `Console` 标签
4. 尝试发送一条消息
5. 查看是否有错误信息

### 步骤3: 使用本地服务器
如果遇到跨域问题，请使用本地服务器：

```bash
# 在网站目录下运行
python3 -m http.server 8000
```

然后在浏览器中访问 `http://localhost:8000`

### 步骤4: 检查API密钥配置
确保您的API密钥在代码中正确配置：

```javascript
// 在 deepseek-api.js 中
this.apiKey = 'sk-5786e431682e4229a2e63994d4968f15';
```

## 🔧 快速修复方案

### 方案1: 添加错误处理
在您的代码中添加更详细的错误处理：

```javascript
async sendMessage(userMessage, sessionId = null) {
    try {
        console.log('发送消息:', userMessage);
        console.log('API密钥:', this.apiKey.substring(0, 10) + '...');
        console.log('API URL:', this.apiUrl);
        
        // 检查网络连接和API密钥
        if (!this.isOnline()) {
            console.log('❌ 网络离线');
            return this.getLocalIntelligentResponse(userMessage);
        }
        
        if (!this.isApiKeyValid()) {
            console.log('❌ API密钥无效');
            return this.getLocalIntelligentResponse(userMessage);
        }
        
        // 继续API调用...
        
    } catch (error) {
        console.error('详细错误信息:', error);
        console.error('错误类型:', error.name);
        console.error('错误消息:', error.message);
        return this.getLocalIntelligentResponse(userMessage);
    }
}
```

### 方案2: 使用代理服务器
如果跨域问题无法解决，可以创建一个简单的代理服务器：

```python
# proxy_server.py
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/deepseek', methods=['POST'])
def proxy_deepseek():
    try:
        # 获取请求数据
        data = request.json
        
        # 转发到DeepSeek API
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': 'Bearer sk-5786e431682e4229a2e63994d4968f15',
                'Content-Type': 'application/json'
            },
            json=data,
            timeout=30
        )
        
        return jsonify(response.json()), response.status_code
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
```

## 📞 进一步帮助

如果以上方案都无法解决问题，请：

1. 使用诊断工具获取详细的错误信息
2. 截图浏览器控制台的错误信息
3. 告诉我具体的错误消息

这样我可以提供更精准的解决方案。

## 🎯 总结

您的DeepSeek API配置是正确的，问题很可能出现在：
- 浏览器跨域限制
- 网络环境限制
- 前端代码中的错误处理

请先使用诊断工具进行测试，然后根据结果采取相应的解决方案。
