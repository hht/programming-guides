# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [typescript Language Gate](../meta/language-gates/typescript.md)。本文件只含 **React SPA 框架 MUST**（禁止与语言闸重复）。

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 列表/详情/用户资料等服务端实体状态以 **TanStack Query** 为 SSOT | `09` / e2e：实体不进 Zustand |
| F02 | MUST NOT | 把服务端实体列表默认放进 Zustand（Zustand **仅** UI 壳与非敏感偏好） | 同上 |
| F03 | MUST NOT | 默认把鉴权 token 写入 `localStorage`；优先 httpOnly cookie | 安全抽检；INPUTS Bearer memory 例外须写明 |
| F04 | MUST | 请求体/表单/search params 校验 schema 以 **Zod** 为单源；`features/*` 只 import | 目录抽检：无第二套 `*.schema.ts` |
| F05 | MUST | Mutation 成功后缓存收敛（`invalidateQueries` 和/或 `setQueryData`） | e2e：列表更新；禁只 toast |
| F06 | MUST NOT | 新增 `lodash` / `moment`；日期用 date-fns，工具用 es-toolkit | package.json 抽检 |
| F07 | MUST | 样式走 Tailwind；可访问组件优先 shadcn/ui（复制进仓） | `01` 栈 + UI 抽检 |
| F08 | MUST | deletion-first；无 INPUTS 的路由/字段不做 | INPUTS 门闸 |

## SSOT

| 真相 | Owner |
|------|--------|
| 路由树 | `src/routes/`（TanStack Router 文件路由） |
| Query key | `src/api/query-keys.ts` |
| API client | `src/api/client.ts` |
| Zod schemas | **`src/api/schemas/` 唯一 SSOT**；`features/*` 只 import，禁止旁挂第二套 `*.schema.ts` |
| 客户端 UI store | `src/stores/` |
| env | `src/config/env.ts`（Zod parse） |
| 文案 | `src/i18n/` 或单语 `messages.ts` |
| 会话 status | `stores/session.ts` |
| Bearer token（若选用） | `api/token.ts` 模块变量 only |

## 超越对照（写入 11）

1. `对照：B（Excalidraw/Outline/Refine）未见「远程实体列表禁止进客户端全局 store」硬门闸 → Query 为 SSOT`  
2. `对照：B 中更弱/未见「await invalidate 后再 navigate」硬顺序 → 本指南要求该顺序 + 发版 e2e`
