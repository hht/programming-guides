# 11 — 世界级验收

## A. 工程面

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录 | [ ] | `02` |
| 命名 / 词表 | [ ] | `02` Pass1 词表 + segment/action |
| 风格 | [ ] | `01` |
| 工具链 | [ ] | create-next-app + lock |
| 门禁 | [ ] | `commands` |
| 极简 | [ ] | 无业务堆模板 |
| 可测 | [ ] | Action 探针 |
| 关键路径 | [ ] | `05` |
| 测试 | [ ] | `09` |
| 安全 | [ ] | Cookie/env |
| a11y/性能 | [ ] | `08` |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有（≥2 URL）

| 能力 | sources | 勾选 |
|------|---------|------|
| App Router 页面 | https://github.com/vercel/next.js · https://github.com/t3-oss/create-t3-app | [ ] |
| 服务端数据 | https://github.com/vercel/next.js · https://github.com/vercel/commerce | [ ] |
| 变更/表单 | https://github.com/vercel/next.js · https://github.com/shadcn-ui/taxonomy | [ ] |
| 组件体系 | https://github.com/shadcn-ui/taxonomy · https://github.com/t3-oss/create-t3-app | [ ] |
| 类型安全 | https://github.com/t3-oss/create-t3-app · https://github.com/vercel/commerce | [ ] |
| 部署就绪 | https://github.com/vercel/next.js · https://github.com/vercel/commerce | [ ] |

## C. §1.3 — 指南达标（维护者勾）

> 交付 agent 的 `check` **不**要求本节（见 `commands` → `check-guide`）。

1. [ ] 能力切条 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：必做 ⊇ 所有共有 
4. [ ] 工程面勾选 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「写路径强制 Server Action + Zod + revalidate」硬门闸 → 本指南要求写路径强制 Server Action + Zod + revalidate（见 05）` 
 - [ ] a2. `对照：B 中更弱/未见「Client 边界最小化（默认 RSC）」硬门闸 → 本指南要求默认 RSC、Client 边界最小（见 03/05）` 
 - [ ] b. `09` 矩阵：Playwright 1–4 + check 覆盖 5–6 
 - c. N/A 
