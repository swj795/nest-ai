# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个 NestJS 框架构建的 RESTful API 项目，使用 MongoDB 数据库。

## Common Commands

```bash
# 开发
npm run start:dev          # 启动开发服务器（热重载）
npm run start:debug        # 启动调试模式

# 构建与运行
npm run build              # 构建生产版本
npm run start              # 运行生产版本
npm run start:prod         # 运行编译后的生产版本

# 代码质量
npm run lint               # 代码检查并自动修复
npm run format             # 代码格式化

# 测试
npm run test               # 运行所有测试
npm run test:watch         # 监听模式运行测试
npm run test:cov           # 生成测试覆盖率报告
```

## Architecture

项目采用标准的 NestJS 模块化架构：

```
src/
├── main.ts               # 应用入口，包含全局管道配置
├── app.module.ts         # 根模块，配置数据库连接和全局模块
├── app.controller.ts     # 根控制器
├── app.service.ts        # 根服务
└── user/                 # 用户模块（示例模块）
    ├── user.module.ts    # 用户模块定义
    ├── user.controller.ts # HTTP 路由处理
    ├── user.service.ts   # 业务逻辑
    └── dto/              # 数据传输对象
        └── create-user.dto.ts
```

### 数据层
- 使用 Mongoose 连接 MongoDB
- 数据库连接通过 `MONGODB_URI` 环境变量配置，默认连接 `mongodb://localhost:27017/ssswj`

### 配置
- 使用 `@nestjs/config` 进行配置管理
- 环境变量通过 `dotenv` 加载
- 全局验证管道：`ValidationPipe`（在 main.ts 中配置）

### API 路由
- 根路径：`/`
- 用户模块：`/user`
  - `GET /user` - 获取所有用户
  - `GET /user/:id` - 根据 ID 获取用户
  - `POST /user` - 创建用户
  - `PUT /user/:id` - 更新用户

## Docker 支持

项目已配置 Dockerfile，可通过以下命令构建和运行：

```bash
docker build -t ai-serve .
docker run -p 3000:3000 ai-serve
```

## Tech Stack

- **框架**: NestJS 11.x
- **数据库**: MongoDB + Mongoose 9.x
- **验证**: class-validator + class-transformer
- **测试**: Jest 30.x
- **代码质量**: ESLint 9.x + Prettier 3.x