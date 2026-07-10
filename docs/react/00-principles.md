# 00 — 原则与不变量

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 硬不变量

1. **服务端状态 ≠ Zustand**：列表/详情/用户资料以 **TanStack Query** 为 SSOT；Zustand 只放 UI 壳（sidebar、主题、wizard 步进）与**非敏感**客户端偏好。  
2. **鉴权 token 默认不进 localStorage**（防 XSS）；优先 httpOnly cookie。若 INPUTS 勾 Bearer memory：刷新页须重新登录（**默认无 silent refresh**）；若产品要 refresh，须在 INPUTS 另附 refresh 端点与轮换规则，否则禁止实现 refresh。  
3. **校验单源**：请求体/表单/search params 的 schema 用 **Zod**；禁止 UI 一套、submit 又一套。  
4. **Mutation 后缓存必须收敛**：`invalidateQueries` 和/或 `setQueryData`；禁止只 toast 成功而列表仍旧。  
5. **工具库**：日期用 **date-fns**；通用工具用 **es-toolkit**；禁止新增 `lodash`/`moment`。  
6. **UI**：样式走 **Tailwind**；可访问组件优先 **shadcn/ui**（复制进仓，不依赖闭源 registry 运行时）。  
7. **deletion-first**；无 INPUTS 的路由/字段不做。

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
