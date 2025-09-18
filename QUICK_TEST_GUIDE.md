# Aurora快速测试指南

## 问题解决：测试账号不管用

如果您遇到测试账号无法使用的问题，请按照以下步骤操作：

## 🚀 快速启动（推荐）

### 1. 启动API服务
```bash
cd backend
npm install
npm run start:api-only
```

### 2. 测试认证功能
```bash
# 在新终端窗口运行
npm run test:auth
```

### 3. 测试前端登录
- 打开浏览器访问 `http://localhost:8000/index.html`
- 点击"登录"按钮
- 使用以下测试账户：
  - **邮箱**: `test@aurora.ai`
  - **密码**: `test123`

## 🔧 详细步骤

### 步骤1：检查后端服务状态

```bash
# 检查API服务是否运行
curl http://localhost:3000/health

# 应该返回：
{
  "status": "healthy",
  "service": "aurora-api-gateway",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0"
}
```

### 步骤2：测试用户注册

```bash
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

### 步骤3：测试用户登录

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@aurora.ai",
    "password": "test123"
  }'
```

### 步骤4：测试前端登录

1. 确保前端服务运行：
   ```bash
   # 在网站根目录
   python -m http.server 8000
   ```

2. 访问登录页面：
   - 打开 `http://localhost:8000/login.html`
   - 或从首页点击"登录"按钮

3. 输入测试账户信息：
   - 邮箱：`test@aurora.ai`
   - 密码：`test123`

4. 点击登录按钮

## 🐛 常见问题排查

### 问题1：API服务无法启动

**错误信息**: `Error: Cannot find module 'xxx'`

**解决方案**:
```bash
cd backend
npm install
```

### 问题2：端口被占用

**错误信息**: `EADDRINUSE: address already in use :::3000`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>

# 或使用其他端口
PORT=3001 npm run start:api-only
```

### 问题3：CORS错误

**错误信息**: `Access to fetch at 'http://localhost:3000' from origin 'http://localhost:8000' has been blocked by CORS policy`

**解决方案**: 检查API服务是否正常启动，CORS配置已包含在代码中。

### 问题4：登录失败

**错误信息**: `认证失败` 或 `邮箱或密码错误`

**解决方案**:
1. 确保使用正确的测试账户：
   - 邮箱：`test@aurora.ai`
   - 密码：`test123`
2. 检查API服务是否运行
3. 查看浏览器控制台错误信息

### 问题5：前端无法连接API

**错误信息**: `Failed to fetch` 或网络错误

**解决方案**:
1. 检查API服务状态：`curl http://localhost:3000/health`
2. 检查防火墙设置
3. 确保端口3000可访问

## 📋 测试检查清单

- [ ] 后端API服务已启动 (`npm run start:api-only`)
- [ ] API健康检查通过 (`curl http://localhost:3000/health`)
- [ ] 用户注册功能正常
- [ ] 用户登录功能正常
- [ ] JWT令牌生成正常
- [ ] 前端登录页面可访问
- [ ] 前端能成功调用后端API
- [ ] 登录后能跳转到对话页面

## 🎯 预期结果

### 成功的登录流程：

1. **API服务启动**:
   ```
   🚀 Aurora API Gateway 启动成功
   📡 服务地址: http://localhost:3000
   🔍 健康检查: http://localhost:3000/health
   ```

2. **用户登录成功**:
   ```json
   {
     "success": true,
     "data": {
       "user": {
         "id": "uuid",
         "email": "test@aurora.ai",
         "username": "testuser"
       },
       "tokens": {
         "accessToken": "jwt_token_here",
         "refreshToken": "refresh_token_here",
         "expiresIn": "24h"
       }
     }
   }
   ```

3. **前端跳转**:
   - 登录成功后自动跳转到 `dialogue.html`
   - 导航栏显示用户信息
   - 可以开始与Aurora对话

## 🆘 获取帮助

如果按照以上步骤仍然无法解决问题，请：

1. **检查日志**:
   ```bash
   # 查看API服务日志
   tail -f backend/logs/combined.log
   ```

2. **运行完整测试**:
   ```bash
   cd backend
   npm run test:auth
   ```

3. **提供错误信息**:
   - 浏览器控制台错误
   - API服务日志
   - 具体的错误步骤

4. **联系支持**:
   - 提交Issue到项目仓库
   - 提供详细的错误信息和环境信息

---

**记住**: 测试账户信息：
- 邮箱：`test@aurora.ai`
- 密码：`test123`

祝您测试顺利！ 🚀
