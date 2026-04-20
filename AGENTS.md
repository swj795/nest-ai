# 仓库指南

## 项目结构与模块组织

这是一个基于 NestJS 的 TypeScript 服务。应用入口位于 `src/main.ts`，根模块位于 `src/app.module.ts`。业务代码按领域拆分到 `src/<feature>/`，当前示例为 `src/user/`，其中包含 controller、service、module、DTO 以及对应的单元测试。端到端测试放在 `test/`，构建产物输出到 `dist/`，覆盖率报告输出到 `coverage/`。

## 构建、测试与开发命令

先执行 `pnpm install` 安装依赖。

- `pnpm run start:dev`：以监听模式启动本地开发服务。
- `pnpm run build`：将 TypeScript 编译到 `dist/`。
- `pnpm run start:prod`：运行编译后的生产构建。
- `pnpm run lint`：执行 ESLint 并自动修复可安全修复的问题。
- `pnpm run format`：用 Prettier 格式化 `src/**/*.ts` 和 `test/**/*.ts`。
- `pnpm run test`、`pnpm run test:cov`、`pnpm run test:e2e`：分别运行单元测试、覆盖率测试和端到端测试。

## 代码风格与命名约定

沿用当前 NestJS 结构：类名使用 `PascalCase`，方法和变量使用 `camelCase`，文件名使用 kebab-case，并保留 Nest 后缀，例如 `user.controller.ts`、`create-user.dto.ts`。Prettier 采用单引号和尾随逗号，默认缩进为 2 个空格。DTO 统一放在 `dto/` 子目录，控制器和服务方法尽量显式声明返回类型，请求体验证优先使用装饰器与 `class-validator`。

## 测试规范

项目使用 Jest 和 `ts-jest`，HTTP 相关断言使用 `supertest`。单元测试文件命名为 `*.spec.ts`，并尽量与被测代码放在同目录；端到端测试放在 `test/*.e2e-spec.ts`。修改控制器路由、DTO 校验或服务逻辑时，应同步补充或更新测试。当前覆盖率统计默认排除 spec 文件、`main.ts` 和 `*.module.ts`。

## 提交与合并请求规范

提交信息遵循当前仓库的简洁 Conventional Commits 风格，例如 `feat: add user update route`、`docs: refresh contributor guide`。PR 应保持聚焦，包含变更说明、关联 issue（如有）、测试结果，以及接口行为变更时的请求/响应示例。

## 配置与安全

开发前从 `.env.example` 复制环境变量模板。应用读取 `MONGODB_URI` 或 `MONGODB_URL`，`PORT` 默认值为 `3000`。不要提交真实密钥、令牌或环境专属配置。
