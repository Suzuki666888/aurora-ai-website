# Aurora前端后端集成测试指南

## 概述

本指南将帮助您测试Aurora前端和后端的完整集成功能，确保所有组件正常工作。

## 测试环境准备

### 1. 启动后端服务

```bash
# 进入后端目录
cd backend

# 开发模式启动（只启动数据库）
./deploy.sh dev

# 或者生产模式启动（完整服务）
./deploy.sh prod
```

### 2. 验证后端服务状态

```bash
# 检查API Gateway
curl http://localhost:3000/health

# 检查Emotion Service
curl http://localhost:8000/health

# 检查Chat Service
curl http://localhost:3001/health
```

### 3. 启动前端服务

```bash
# 在网站根目录启动本地服务器
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve .

# 或使用Live Server扩展（推荐）
```

## 测试流程

### 第一阶段：基础功能测试

#### 1. 页面加载测试
- [ ] 打开 `http://localhost:8000/index.html`
- [ ] 检查页面是否正常加载
- [ ] 验证所有动画效果是否正常
- [ ] 检查导航栏是否显示

#### 2. 导航功能测试
- [ ] 点击"理念"链接，跳转到 `philosophy.html`
- [ ] 点击"对话奇点"链接，跳转到 `dialogue.html`
- [ ] 点击"真理模块"中的"引言"数据晶片，跳转到 `introduction.html`
- [ ] 点击"技术原理"数据晶片，跳转到 `technology.html`

#### 3. 登录功能测试
- [ ] 点击导航栏的"登录"按钮
- [ ] 跳转到登录页面 `login.html`
- [ ] 检查登录表单是否正常显示

### 第二阶段：认证功能测试

#### 1. 用户注册测试
```bash
# 使用curl测试注册API
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@aurora.ai",
    "username": "testuser",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### 2. 用户登录测试
```bash
# 使用curl测试登录API
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@aurora.ai",
    "password": "test123"
  }'
```

#### 3. 前端登录测试
- [ ] 在登录页面输入测试账户信息
- [ ] 点击登录按钮
- [ ] 检查是否成功跳转到对话页面
- [ ] 验证导航栏是否显示用户信息

### 第三阶段：API集成测试

#### 1. 情感分析API测试
```bash
# 测试情感分析API
curl -X POST http://localhost:3000/api/v1/emotion/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "text": "我今天心情很好，工作很顺利",
    "context": {
      "previousMessages": []
    }
  }'
```

#### 2. 对话API测试
```bash
# 测试对话API
curl -X POST http://localhost:3000/api/v1/emotion/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "你好，Aurora",
    "sessionId": "test_session_123"
  }'
```

#### 3. 前端对话测试
- [ ] 在对话页面发送消息
- [ ] 检查是否收到Aurora的回复
- [ ] 验证情感状态是否更新
- [ ] 检查建议功能是否正常

### 第四阶段：完整流程测试

#### 1. 完整用户旅程测试
1. [ ] 访问首页
2. [ ] 点击登录按钮
3. [ ] 输入用户信息并登录
4. [ ] 跳转到对话页面
5. [ ] 发送多条消息
6. [ ] 检查对话历史
7. [ ] 测试建议功能
8. [ ] 退出登录

#### 2. 错误处理测试
- [ ] 测试无效登录信息
- [ ] 测试网络断开情况
- [ ] 测试API服务不可用情况
- [ ] 验证错误消息显示

#### 3. 性能测试
- [ ] 测试页面加载速度
- [ ] 测试API响应时间
- [ ] 测试大量消息处理
- [ ] 测试内存使用情况

## 测试数据

### 测试用户账户
```json
{
  "email": "test@aurora.ai",
  "username": "testuser",
  "password": "test123",
  "firstName": "Test",
  "lastName": "User"
}
```

### 测试消息
```javascript
const testMessages = [
    "你好，Aurora",
    "我今天心情很好",
    "我遇到了一些困难",
    "你能帮助我吗？",
    "谢谢你的建议"
];
```

## 常见问题排查

### 1. CORS错误
**问题**: 浏览器控制台显示CORS错误
**解决方案**: 
- 检查后端CORS配置
- 确保前端域名在允许列表中
- 检查请求头设置

### 2. 认证失败
**问题**: API返回401错误
**解决方案**:
- 检查token是否正确
- 验证token是否过期
- 检查认证中间件配置

### 3. API连接失败
**问题**: 无法连接到后端API
**解决方案**:
- 检查后端服务是否启动
- 验证API端点URL
- 检查网络连接

### 4. 页面加载问题
**问题**: 页面无法正常加载
**解决方案**:
- 检查静态文件路径
- 验证服务器配置
- 检查浏览器控制台错误

## 调试工具

### 1. 浏览器开发者工具
- **Network**: 检查API请求和响应
- **Console**: 查看JavaScript错误和日志
- **Application**: 检查localStorage和sessionStorage
- **Sources**: 调试JavaScript代码

### 2. 后端日志
```bash
# 查看API Gateway日志
docker-compose logs -f api-gateway

# 查看Emotion Service日志
docker-compose logs -f emotion-service

# 查看数据库日志
docker-compose logs -f postgres
```

### 3. API测试工具
- **Postman**: 测试API端点
- **curl**: 命令行API测试
- **浏览器**: 直接访问API文档

## 性能监控

### 1. 前端性能
- 页面加载时间
- API响应时间
- 内存使用情况
- 动画流畅度

### 2. 后端性能
- API响应时间
- 数据库查询时间
- 服务资源使用
- 并发处理能力

## 测试报告模板

### 测试结果记录
```
测试日期: ___________
测试人员: ___________
测试环境: ___________

功能测试结果:
□ 页面加载正常
□ 导航功能正常
□ 登录功能正常
□ 对话功能正常
□ 情感分析正常
□ 建议功能正常
□ 错误处理正常

性能测试结果:
□ 页面加载时间 < 3秒
□ API响应时间 < 2秒
□ 内存使用正常
□ 动画流畅度良好

问题记录:
1. ________________
2. ________________
3. ________________

总体评价:
□ 优秀 □ 良好 □ 一般 □ 需要改进
```

## 部署前检查清单

- [ ] 所有功能测试通过
- [ ] 性能测试达标
- [ ] 错误处理完善
- [ ] 安全配置正确
- [ ] 数据库备份完成
- [ ] 环境变量配置正确
- [ ] SSL证书配置完成
- [ ] 监控系统就绪

## 联系支持

如果在测试过程中遇到问题，请：

1. 查看本文档的常见问题部分
2. 检查浏览器控制台错误信息
3. 查看后端服务日志
4. 提交Issue到项目仓库

---

**祝您测试顺利！** 🚀
