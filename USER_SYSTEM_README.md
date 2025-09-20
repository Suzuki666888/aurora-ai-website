# Aurora用户系统使用指南

## 🎯 系统概述

Aurora用户系统是一个完整的用户管理解决方案，支持用户注册、登录、数据本地存储、偏好设置管理等功能。系统采用前后端分离架构，确保数据安全和用户体验。

## 🚀 快速开始

### 1. 启动系统

```bash
# 使用启动脚本（推荐）
./start-user-system.sh

# 或手动启动
cd backend
npm install
npm run start:api-only

# 在另一个终端启动前端
python3 -m http.server 8080
```

### 2. 访问系统

- **前端网站**: http://localhost:8080
- **后端API**: http://localhost:3000
- **API文档**: http://localhost:3000/api-docs

### 3. 测试账户

- **邮箱**: test@aurora.ai
- **密码**: test123

## 📱 功能特性

### ✅ 用户认证
- 用户注册（邮箱、用户名、密码）
- 用户登录（JWT令牌认证）
- 密码强度检测
- 自动登录状态管理

### ✅ 数据管理
- 本地数据存储（localStorage）
- 云端数据同步
- 情感分析记录
- 对话会话管理
- 数据导出功能

### ✅ 用户设置
- 偏好设置（主题、语言、通知）
- 隐私设置（数据共享、分析、广告）
- 数据保留期设置
- 实时设置同步

### ✅ 用户中心
- 使用统计信息
- 数据概览
- 设置管理
- 数据操作

## 🔧 技术架构

### 后端技术栈
- **Node.js + Express.js**: API服务器
- **JWT**: 用户认证
- **bcryptjs**: 密码加密
- **express-validator**: 数据验证
- **Swagger**: API文档

### 前端技术栈
- **原生JavaScript**: 前端逻辑
- **localStorage**: 本地数据存储
- **CSS3**: 现代化UI设计
- **Font Awesome**: 图标库

### 数据存储
- **内存存储**: 开发环境（可扩展为数据库）
- **localStorage**: 客户端数据缓存
- **JWT令牌**: 会话管理

## 📊 API接口

### 认证接口
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/refresh` - 刷新令牌
- `POST /api/v1/auth/logout` - 用户登出
- `GET /api/v1/auth/me` - 获取当前用户信息

### 用户数据接口
- `GET /api/v1/user/data` - 获取用户数据
- `POST /api/v1/user/data` - 保存用户数据
- `POST /api/v1/user/emotion` - 添加情感记录
- `POST /api/v1/user/chat` - 添加对话会话
- `PUT /api/v1/user/preferences` - 更新偏好设置
- `PUT /api/v1/user/privacy` - 更新隐私设置
- `GET /api/v1/user/stats` - 获取统计信息
- `GET /api/v1/user/export` - 导出用户数据
- `DELETE /api/v1/user/delete` - 删除用户数据

## 🎨 页面结构

### 主要页面
1. **index.html** - 首页（已更新用户状态显示）
2. **login.html** - 登录页面
3. **register.html** - 注册页面
4. **user-dashboard.html** - 用户中心
5. **dialogue.html** - 对话页面

### 核心文件
- **js/auth-manager.js** - 认证管理器（已扩展）
- **backend/src/services/user-service/userService.js** - 用户服务
- **backend/src/services/api-gateway/routes/user.js** - 用户API路由

## 🔒 安全特性

### 数据安全
- 密码bcrypt加密存储
- JWT令牌认证
- 请求参数验证
- CORS跨域保护
- 速率限制

### 隐私保护
- 本地数据存储
- 用户控制数据共享
- 数据匿名化选项
- 数据删除功能

## 📈 使用流程

### 新用户注册
1. 访问 http://localhost:8080
2. 点击"登录"按钮
3. 选择"注册新账户"
4. 填写注册信息
5. 完成注册后自动跳转到登录页面

### 用户登录
1. 在登录页面输入邮箱和密码
2. 系统验证用户信息
3. 登录成功后跳转到对话页面
4. 用户状态在导航栏显示

### 数据管理
1. 点击导航栏用户头像
2. 选择"用户中心"
3. 查看统计信息和数据概览
4. 管理偏好设置和隐私设置
5. 导出或同步数据

## 🛠️ 开发指南

### 添加新功能
1. 在后端添加API路由
2. 在前端auth-manager.js中添加对应方法
3. 更新用户界面
4. 测试功能完整性

### 数据模型
```javascript
// 用户数据结构
{
  id: "uuid",
  email: "user@example.com",
  username: "username",
  preferences: {
    theme: "dark",
    language: "zh-CN",
    notifications: true,
    privacy: "standard"
  },
  privacySettings: {
    dataSharing: false,
    analytics: true,
    personalizedAds: false,
    dataRetention: "90"
  }
}

// 用户数据存储
{
  emotionHistory: [],
  chatSessions: [],
  preferences: {},
  privacySettings: {},
  lastSync: "2024-01-01T00:00:00Z"
}
```

## 🐛 故障排除

### 常见问题
1. **后端服务启动失败**
   - 检查Node.js版本（需要18+）
   - 确保端口3000未被占用
   - 检查依赖安装是否完整

2. **前端无法连接后端**
   - 确认后端服务正在运行
   - 检查CORS设置
   - 验证API地址配置

3. **用户数据丢失**
   - 检查localStorage是否被清除
   - 尝试数据同步功能
   - 查看浏览器控制台错误

### 调试模式
```bash
# 启用详细日志
export DEBUG=aurora:*
npm run start:api-only
```

## 📝 更新日志

### v1.0.0 (2024-01-01)
- ✅ 完整的用户认证系统
- ✅ 本地数据存储功能
- ✅ 用户中心界面
- ✅ 偏好和隐私设置
- ✅ 数据导出和同步
- ✅ API文档和测试

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 📄 许可证

MIT License - 详见LICENSE文件

---

**Aurora用户系统** - 让情感AI更懂你 ❤️
