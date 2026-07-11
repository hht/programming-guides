# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [typescript Language Gate](../meta/language-gates/typescript.md)。  
> 客户端 React 习惯若与 SPA 重叠 → **以 [react/00](../react/00-principles.md) 为 SSOT**，本册只写 App Router 增量。

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 框架 MUST（App Router）

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| N01 | MUST | 默认 Server Component；`"use client"` 仅交互边界 | 目录抽检；`03`/`05` |
| N02 | MUST | 写操作走 Server Action（或 INPUTS 明示的 Route Handler） | `05` + e2e |
| N03 | MUST NOT | 默认「纯客户端 fetch 写库」 | 同上 |
| N04 | MUST | Action 入口 Zod 校验；失败可辨，不假成功 | 单测 case→期望 |
| N05 | MUST | 变更后 `revalidatePath` / `revalidateTag` 写明 | `05` + e2e |
| N06 | MUST NOT | 密钥进入 `NEXT_PUBLIC_*` | env 抽检 |
| N07 | MUST | deletion-first；与 Vite SPA（react 册）边界清晰，不抄 Router 栈 | `01` + INPUTS |

## SSOT

| 真相 | Owner |
|------|--------|
| 路由树 | `app/` |
| 读数据 | RSC / `04` |
| 写路径 | `05` Server Action |
| 环境 | INPUTS §6 + `.env.example` |

## 超越

1. `对照：B 中更弱/未见「写路径强制 Server Action + Zod + revalidate」硬门闸 → 本指南要求`  
2. `对照：B 中更弱/未见「Client 边界最小化（默认 RSC）」硬门闸 → 本指南要求`
