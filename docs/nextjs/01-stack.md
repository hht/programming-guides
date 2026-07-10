# 01 — 默认栈（钉死）

| 层 | 选择 |
|----|------|
| Runtime | Node ≥22 |
| 包管理 | **pnpm** + lockfile |
| 框架 | **Next.js** 最新稳定 App Router |
| UI | React 19 + TypeScript strict |
| 样式 | Tailwind CSS v4 + **shadcn/ui** |
| 校验 | **Zod** |
| 表单 | react-hook-form + zod resolver（Client 表单）或 Action 直收 FormData |
| 测试 | Vitest + Playwright |
| 数据访问（DB） | **Drizzle ORM** + 官方 driver | INPUTS§3 含 DB 时必装；禁开口 Prisma/裸 SQL 任选 |
| 数据访问（HTTP） | `fetch` + Zod parse | 外部 API；禁默认 axios |
| 会话 Cookie | 名=`session`；HttpOnly+Secure+SameSite=Lax；值=签名/加密 token（实现自写或接 auth 册） | INPUTS§5=Cookie 时 |

**禁止开口**：Pages Router 与 App Router 任选；「tRPC 或 Action 任选」——**默认 Server Actions**（tRPC 仅 INPUTS 明示）。

## 脚手架

```bash
pnpm create next-app@latest <name> --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd <name>
pnpm dlx shadcn@latest init
pnpm add zod react-hook-form @hookform/resolvers
pnpm add -D vitest @vitejs/plugin-react playwright @playwright/test
```

版本取创建稳定并锁 lockfile。Action/`uses` 在 CI 钉 SHA（见 ops 指南）。

## 冲突

| 流行 | 本指南 | 理由 |
|------|--------|------|
| 默认 tRPC | Server Actions | 更少边界、与 RSC 同构 |
| Pages Router | App Router | 官方主推 |
| Vite SPA 栈 | 另册 `react/` | 品类不同 |
