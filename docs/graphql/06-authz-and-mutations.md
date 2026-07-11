# 06 — 鉴权与 Mutation

## 不变量

- **所有 Mutation** 必须：① 通过鉴权（Session Gate / Bearer）② 输入校验（SDL 非空字段 + resolver/用例校验）。 
- **禁止**公开 mutation 裸奔；**禁止**把 GraphQL 当无鉴权万能 CRUD。 
- 鉴权语义 **不** 在本册重定义 → 引用 [docs/auth](../auth/README.md)；本册只约定 GraphQL 接线点（Context.subject）。 
- 超越 a2：对照标杆更弱/未见「写操作必须鉴权+校验」硬门闸 → 本指南强制（见 `11`）。

## 步骤规格（实现自写）

1. Yoga `context` 工厂：对每请求调用 Session Gate（或 Bearer）；注入 `subject`（词表）；**禁止**把 raw Cookie/token 传入业务 resolver。 
2. Mutation resolver 首行（或统一中间层）：断言 `context.subject` 存在；缺失 → `UNAUTHENTICATED`。 
3. 输入：SDL 用非空 (`!`) 表达必填；额外业务校验失败 → `VALIDATION_FAILED`（字段路径进 extensions 可选）。 
4. 授权：资源级权限失败 → `FORBIDDEN`（已有 Subject）。 
5. 公开只读：仅 INPUTS §6 allowlist；新增公开字段 = INPUTS + 安全评审勾选，默认拒绝。 
6. 写路径与 DB：副作用在鉴权+校验通过之后；失败须无脏写（对接 postgres 事务册若适用）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 匿名 Mutation | `UNAUTHENTICATED`；HTTP/错误策略按 INPUTS §7 |
| 已登录无权限 | `FORBIDDEN` |
| 缺必填 / 非法标量 | `VALIDATION_FAILED`；不写库 |
| 「顺便」暴露 admin CRUD | 禁止；须显式权限 + 非默认公开 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 匿名调用任意 Mutation | 拒绝；DB 无变化 |
| 合法 Subject + 合法输入 | 写成功或业务码 |
| 合法 Subject + 缺必填 | VALIDATION_FAILED；无写 |
| 合法 Subject + 无资源权限 | FORBIDDEN |
| 公开 Query allowlist 外字段 | 未认证拒绝 |
