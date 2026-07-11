# 来源与差距

## P0

| 主题 | URL |
|------|-----|
| Next.js App Router | https://nextjs.org/docs/app |
| Server Actions | https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations |
| Caching | https://nextjs.org/docs/app/building-your-application/caching |

## 标杆 B

| ID | 仓库 | 学什么 | 不学什么 |
|----|------|--------|----------|
| A | [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app) | 类型安全全栈骨架 | 强制 tRPC 默认 |
| B | [vercel/commerce](https://github.com/vercel/commerce) | 电商级 App Router 实践 | 抄业务 |
| C | [shadcn-ui/taxonomy](https://github.com/shadcn-ui/taxonomy) | 内容站 + shadcn 结构 | 旧版细节 |

## 共有能力

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| App Router | ✓ | ✓ | ✓ | 必做 |
| 服务端读 | ✓ | ✓ | ✓ | 必做 |
| 变更 | ✓ | ✓ | ✓ | 必做 |
| UI 体系 | ✓ | ✓ | ✓ | 必做 |
| 类型安全 | ✓ | ✓ | ✓ | 必做 |
| 可部署 | ✓ | ✓ | ✓ | 必做 |

## 差距

| 缺口 | 落入 | 必做 |
|------|------|------|
| Action+Zod+revalidate | `05` | 超越 |
| 默认 RSC | `00`/`03` | 超越 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| T3 默认 tRPC | 本册 Server Actions |
| 与 Vite react 混栈 | 分册 |

## 对抗

| 日期 | ROUND | SCORE | model |
|------|-------|-------|-------|
| 2026-07-11 | gate+framework MUST 重审 | 5/5 | grok-4.5-fast-xhigh |

