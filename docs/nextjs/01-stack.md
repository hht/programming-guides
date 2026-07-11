# 01 — 默认栈

| 层 | 选择 |
|----|------|
| Runtime | Node ≥22 |
| 包管理 | **pnpm** + lockfile |
| 框架 | **Next.js** 最新稳定 App Router |
| UI | React 19 + TypeScript strict |
| 样式 | Tailwind CSS v4 + **shadcn/ui** |
| 校验 | **Zod** |
| 表单 | react-hook-form + zod resolver 或 Action 收 FormData |
| 测试 | Vitest + Playwright |
| 数据访问（DB） | **Drizzle ORM** + 官方 driver（INPUTS§3 含 DB） |
| 数据访问（HTTP） | `fetch` + Zod |
| 会话 Cookie | 名=`session`；HttpOnly+Secure+SameSite=Lax |

**禁止开口**：Pages vs App；tRPC vs Action（默认 Actions）；Prisma vs Drizzle（默认 Drizzle）。

## 脚手架

```bash
pnpm create next-app@latest <name> --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd <name>
pnpm dlx shadcn@latest init
pnpm add zod react-hook-form @hookform/resolvers
# 若 INPUTS§3 含 DB（dialect 默认 postgresql）：
pnpm add drizzle-orm postgres && pnpm add -D drizzle-kit
pnpm add -D vitest @vitejs/plugin-react playwright @playwright/test
```

版本取当日稳定并锁 lockfile。

## 冲突

| 流行 | 本指南 | 理由 |
|------|--------|------|
| tRPC | Server Actions | 与 RSC 同构 |
| Pages Router | App Router | 官方主推 |
| Prisma | Drizzle | 更贴近 SQL SSOT |
| Vite SPA | 另册 `react/` | 品类不同 |
