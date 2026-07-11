# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（写明词根；路径可按应用册微调，**词根不可改**）

```text
<repo>/
 UBIQUITOUS_LANGUAGE.md
 # --- 按应用册 ---
 # Next / React：features/tenant/、features/membership/、features/billing/（无计费则无后者）
 # Go：internal/tenant/、internal/membership/、internal/billing/
 # FastAPI：tenant/、membership/、billing/ 包
 migrations/ # tenants、memberships、roles、permissions、audit_events…
 # 禁：tenant_manager/、saasService/、handleTenant.ts 作领域主名
```

## 依赖方向

```text
HTTP → Session Gate (auth) → Tenant Gate → 业务用例
 ↓
 set app.tenant_id (RLS) / scoped repo
 ↓
 Audit append
Billing webhook（若启用）→ BillingStatus 转移 →（可选）阻断写路径
```

禁止：业务用例直接信 Host 头当租户；Gate 内嵌支付 API 细节；绕过 Gate 的「内部」查询无租户上下文。

## UI 状态落点（有产品 UI 时必做）

| 状态 | 含义 | 落点 |
|------|------|------|
| `select-tenant` | 已登录多租户待选 | 路由/页：选租户后绑定当前上下文 |
| `not-a-member` | 已登录但非该租户成员 | 403 页或提示；API 403 |
| `invite-pending` | 邀请未接受 | 接受邀请流 |
| `billing-inactive` | 计费停用阻断写（若启用） | 提示升级/续费；读可按产品约定 |

无产品 UI（纯 API）→ 上表标 **N/A**，仅保留 HTTP 语义。

## Pass 1 — 业务语义（必做）

目标仓建立 `UBIQUITOUS_LANGUAGE.md`，至少收录：

| Term | 含义 | 代码符号 | 禁同义词 |
|------|------|----------|----------|
| Tenant | 租户边界实体 | `Tenant` | Org/Workspace/Account **混用**（择一规定为 Tenant 或在词表声明别名唯一映射） |
| Membership | subject 与 tenant 的成员关系 | `Membership` | `TenantUser` 并行 |
| Role | 租户内角色 | `Role` | `AccessLevel` 分叉 |
| Permission | 可检查的权限码 | `Permission` / `permission` | `Capability` 未收则禁 |
| Tenant Gate | 解析租户并授权后注入上下文 | `TenantGate` / `requireTenant` | `TenantManager`、`handleTenant` |
| Tenant Context | 请求内已校验的租户+成员+角色 | `TenantContext` | — |
| Invite | 邀请加入租户 | `Invite` | — |
| Plan | 计费计划 | `Plan` | `Tier` 未收则禁并行 |
| Seat | 席位 | `Seat` | — |
| BillingStatus | 计费状态机状态 | `BillingStatus` | `SubscriptionState` 择一 |
| Audit Event | 审计记录 | `AuditEvent` | — |
| TENANT_NOT_FOUND | 租户不存在 | `TENANT_NOT_FOUND` | — |
| TENANT_MISMATCH | 解析与绑定不一致 | `TENANT_MISMATCH` | — |
| NOT_A_MEMBER | 非成员 | `NOT_A_MEMBER` | `UNAUTHORIZED_TENANT` |
| BILLING_INACTIVE | 计费不允许写 | `BILLING_INACTIVE` | — |

**禁**：`*Dto`、`*Manager`、`*Service`（作类型后缀）、`handle*`、`process*`、`TenantHelper` 进领域主名。

| 概念 | 正例 | 反例 |
|------|------|------|
| 模块 | `tenant/`、`membership/` | `tenant_manager/`、`saasService/` |
| 门闸 | `RequireTenant` / `tenantGate` | `HandleTenant`、`AuthzMiddlewareManager` |
| 错误 | `NOT_A_MEMBER`、`FORBIDDEN` | `ERR_SAAS_1`、`DtoValidationFailed` |

## Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| TS | 类型/组件 Pascal；函数 camel；文件 kebab 或与仓一致 |
| Go | 导出 Pascal；包名 `tenant` / `membership` |
| Python | 模块 snake；类 Pascal |
| 头 / 路径 | `X-Tenant-Id`（或 INPUTS 约定名）；slug kebab |
| 错误码 | `SCREAMING_SNAKE` 与词表一致 |
| DB 列 | snake_case：`tenant_id`、`subject`、`role_id`、`billing_status` |
