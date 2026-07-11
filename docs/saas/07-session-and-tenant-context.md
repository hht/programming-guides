# 07 — 会话与租户上下文

> **身份 SSOT = [docs/auth](../auth/README.md)。** 本文件钉「会话之后如何安全得到租户上下文」。

## 不变量

- Subject **只**来自 Session Gate（或 auth 模式 D 的 Bearer Gate）；Tenant Gate **不得**自己解析 Cookie 当登录。  
- 「当前租户」绑定（Cookie/会话字段）仅为 Resolve **候选**；每次请求重验 Membership。  
- 子域名解析：Host → slug → `tenants` 查找；**查找成功 ≠ 授权**；无 Membership 仍 `NOT_A_MEMBER`。  
- 登出（auth Logout）须清除租户绑定（若有）；撤销 Membership 后即使 Cookie 仍在也 Gate 失败。

## 步骤规格（实现自写）

1. **管道顺序**：`SessionGate` → `TenantGate` → handler。  
2. **Resolve 优先级（默认，INPUTS 可改但须书面）**：显式头/路径 id > 子域名 slug > 会话绑定当前租户。冲突 → `TENANT_MISMATCH`。  
3. **绑定更新**：用户在 UI `select-tenant` 成功 Gate 后，写入会话侧 `current_tenant_id`（可选 Cookie）；**不**替代步骤 2–3 校验。  
4. **多租户用户**：列表 Memberships API 仅返回该 Subject 的租户；切换走步骤 3。  
5. **CSRF**：浏览器写操作仍遵守 auth `07`；租户头不替代 CSRF。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 有会话无租户候选且路由需要租户 | 400 或进入 `select-tenant`（INPUTS） |
| 子域名租户存在但非成员 | 403 `NOT_A_MEMBER` |
| 会话绑定租户已撤销成员 | 403；清绑定 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 有效会话 + 非成员子域名 | 403；无数据 |
| 绑定租户 A 但头传租户 B 且均为成员 | 按优先级或 `TENANT_MISMATCH`（与 INPUTS 一致） |
| Logout 后再访 | 401；无租户上下文泄漏 |
| 撤销成员后旧绑定 | 403 |
