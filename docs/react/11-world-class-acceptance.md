# 11 — 世界级验收

## A. 工程面（§1.2）

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` |
| 命名 / 词表 | [ ] | `02` Pass1 词表 + query-keys/schema |
| 代码风格 | [ ] | `01` 钉栈 |
| 工具链 | [ ] | Vite + pnpm lock |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无指南业务实现 |
| 逻辑清晰可测 | [ ] | schema/domain 单测 |
| 关键路径 | [ ] | `05` Mutation Lifecycle |
| 测试 | [ ] | `09` |
| 安全（应用层） | [ ] | 鉴权/token 策略 `07` |
| 无障碍 / 性能 | [ ] | 遵守 `08` 预算 **或** 本行写「裁剪：理由=…」 |
| 运维第三方 | N/A | 不进必勾 |

## B. 功能共有（须带 sources URL）

| 能力 | sources（≥2 URL） | 勾选 |
|------|-------------------|------|
| SPA 客户端路由 | https://github.com/excalidraw/excalidraw · https://github.com/outline/outline | [ ] |
| 异步加载与加载态 | https://github.com/outline/outline · https://github.com/refinedev/refine | [ ] |
| 创建/更新提交 | https://github.com/outline/outline · https://github.com/refinedev/refine | [ ] |
| 鉴权或「无登录」声明 | https://github.com/outline/outline · https://github.com/refinedev/refine（或 INPUTS 勾无登录） | [ ] |
| 表单校验 | https://github.com/excalidraw/excalidraw · https://github.com/refinedev/refine | [ ] |
| 错误/空态 | https://github.com/outline/outline · https://github.com/excalidraw/excalidraw | [ ] |

## C. 达到 / 超越（复制元指南 §1.3）

1. [ ] 能力切条：差距表功能行均为用户可感知能力  
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 默认可选  
3. [ ] 功能面达到：必做 ⊇ 所有共有（上表共有项均交付）  
4. [ ] 工程面达到：§A 必做维均有章节 + 本页勾选  
5. [ ] **超越 a+b**（须同时）：  
   - [ ] **a.** ≥2 条更硬不变量（格式 `对照：B 中未见/更弱 → 本指南要求 …`；核对锚点= [sources.md](./sources.md) 差距表对应行 + 下列仓 README/架构，B 无对等硬门闸即「未见」）：  
     1. `对照：B 中未见「远程实体列表禁止进客户端全局 store」硬门闸 → 本指南要求 Query 为 SSOT，Zustand 禁存实体列表`（锚点：sources 差距表「Query 为服务端状态 SSOT」）  
     2. `对照：B 中更弱/未见「mutation 成功必须 await invalidate 后再 navigate」硬顺序 → 本指南要求该顺序 + 发版 e2e#2`（锚点：sources「Mutation 后缓存一致」）  
   - [ ] **b.** 发版场景×断言：见 [09](./09-testing-ci.md) 矩阵 1–5（本页不重复抄表，勾选即表示已按 09 跑通）  
   - **c.** N/A（\(B\) 为开源）

## D. 环境

| 项 | 勾选 |
|----|------|
| staging/prod API Base 成对 | [ ] |
