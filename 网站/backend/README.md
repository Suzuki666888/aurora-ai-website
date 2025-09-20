# Aurora 后端架构

## 概述

Aurora后端采用微服务架构，结合Node.js和Python的优势，构建一个能够理解、分析和响应用户情感状态的智能系统。

## 技术栈

### 核心服务
- **Node.js + Express**: Web API服务
- **Python + FastAPI**: AI/ML服务
- **PostgreSQL**: 主数据库
- **Redis**: 缓存和会话管理
- **MongoDB**: 非结构化数据存储

### AI/ML框架
- **Transformers (Hugging Face)**: 情感分析模型
- **PyTorch**: 深度学习框架
- **scikit-learn**: 传统机器学习
- **OpenAI API**: GPT模型集成

### 部署和监控
- **Docker**: 容器化部署
- **Nginx**: 反向代理
- **PM2**: Node.js进程管理
- **Prometheus + Grafana**: 监控

## 架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Load Balancer │    │   API Gateway    │
│   (React/Vue)   │◄──►│   (Nginx)       │◄──►│   (Express)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────────────────────┼─────────────────────────────────┐
                       │                                 │                                 │
                       ▼                                 ▼                                 ▼
              ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
              │  Auth Service   │              │ Emotion Service │              │  Chat Service   │
              │   (Node.js)     │              │   (Python)      │              │   (Node.js)     │
              └─────────────────┘              └─────────────────┘              └─────────────────┘
                       │                                 │                                 │
                       ▼                                 ▼                                 ▼
              ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
              │   PostgreSQL    │              │   Redis Cache   │              │    MongoDB      │
              │   (用户数据)     │              │   (会话缓存)     │              │   (对话记录)     │
              └─────────────────┘              └─────────────────┘              └─────────────────┘
```

## 服务说明

### 1. API Gateway (Node.js + Express)
- 统一API入口
- 请求路由和负载均衡
- 认证和授权
- 限流和监控

### 2. Emotion Service (Python + FastAPI)
- 多模态情感分析
- 情感GPT模型服务
- 情感导航系统
- 实时情感状态监控

### 3. Chat Service (Node.js + Express)
- 对话管理
- 消息路由
- 上下文维护
- 实时通信

### 4. Auth Service (Node.js + Express)
- 用户认证
- JWT令牌管理
- 权限控制
- 隐私保护

## 快速开始

### 环境要求
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Redis 6+
- Docker (可选)

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo>
cd aurora-backend
```

2. **安装依赖**
```bash
# Node.js服务
npm install

# Python服务
pip install -r requirements.txt
```

3. **配置环境变量**
```bash
cp .env.example .env
# 编辑.env文件，配置数据库连接等
```

4. **启动服务**
```bash
# 启动所有服务
npm run dev

# 或分别启动
npm run start:api
npm run start:emotion
npm run start:chat
```

## API文档

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/refresh` - 刷新令牌
- `POST /api/auth/logout` - 用户登出

### 情感分析接口
- `POST /api/emotion/analyze` - 情感分析
- `POST /api/emotion/chat` - 情感对话
- `GET /api/emotion/status` - 情感状态
- `POST /api/emotion/navigate` - 情感导航

### 对话接口
- `POST /api/chat/send` - 发送消息
- `GET /api/chat/history` - 获取历史
- `POST /api/chat/context` - 更新上下文
- `DELETE /api/chat/session` - 清除会话

## 部署

### Docker部署
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 生产环境
```bash
# 使用PM2管理进程
pm2 start ecosystem.config.js
```

## 监控和日志

- **日志**: Winston + ELK Stack
- **监控**: Prometheus + Grafana
- **错误追踪**: Sentry
- **性能监控**: New Relic

## 安全考虑

- **数据加密**: AES-256加密
- **传输安全**: HTTPS/TLS
- **隐私保护**: 差分隐私
- **访问控制**: RBAC权限模型
- **审计日志**: 完整的操作记录

## 开发指南

### 代码规范
- ESLint + Prettier (Node.js)
- Black + Flake8 (Python)
- 提交信息规范: Conventional Commits

### 测试
- Jest (Node.js单元测试)
- Pytest (Python单元测试)
- Postman (API测试)
- Cypress (E2E测试)

### 文档
- API文档: Swagger/OpenAPI
- 代码文档: JSDoc + Sphinx
- 架构文档: Mermaid图表
