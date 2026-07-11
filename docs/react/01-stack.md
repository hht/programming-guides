# 01 — 默认栈

## 栈表

| 层 | 选择 | 备注 |
|----|------|------|
| Runtime | Node ≥22 | `engines.node` |
| 包管理 | **pnpm** | 提交 lockfile |
| 构建 | **Vite** 最新稳定 | SPA，`index.html` 入口 |
| UI 运行时 | **React ^19.2** | |
| 语言 | **TypeScript strict** + ESM | |
| 路由 | **@tanstack/react-router** | 先进优先（typed routes/search/loader）；非下载量第一 |
| 服务端状态 | **@tanstack/react-query** | |
| 客户端状态 | **zustand** | |
| 校验 | **zod** ^4 | |
| 表单 | **react-hook-form** + **@hookform/resolvers** | 与 shadcn Form 配套 |
| 样式 | **tailwindcss** ^4 | |
| 组件 | **shadcn/ui**（new-york） | `pnpm dlx shadcn@latest init` |
| 图标 | **lucide-react** | shadcn 默认 |
| 日期 | **date-fns** | 禁 moment |
| 工具 | **es-toolkit** | 禁新增 lodash |
| 测试 | **Vitest** + **@testing-library/react** + **Playwright** | |
| Lint / fmt | ESLint flat + typescript-eslint；Prettier | 命令字符串 SSOT → [typescript Language Gate](../meta/language-gates/typescript.md) |

**禁止开口**：Next.js / Remix / React Router 与 TanStack Router 任选 — **只约定本表**。  
语言硬门闸：见 [typescript.md](../meta/language-gates/typescript.md)（**不**在本文件复述）。

## 脚手架（按序）

```bash
pnpm create vite@latest <name> --template react-ts
cd <name>
pnpm install
# Tailwind v4 + Vite 插件按官网当前步骤
pnpm dlx shadcn@latest init # style: new-york；CSS variables: yes
pnpm add @tanstack/react-router @tanstack/react-query zustand zod react-hook-form @hookform/resolvers date-fns es-toolkit lucide-react
pnpm add -D @tanstack/router-plugin @tanstack/react-query-devtools vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom playwright @playwright/test
# 按需 shadcn 组件：
pnpm dlx shadcn@latest add button input form card dialog dropdown-menu sonner table
```

锁版本：`^` 主版本内；发版前人工看 `pnpm outdated`。

## React Compiler

可选开启（Vite babel 插件）；**不**默认强制。开启则全仓一致，禁止局部 `memo` 炫技。
