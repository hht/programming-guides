# 05 — Tenant Gate Lifecycle（核心）

> **全文唯一核心正确性路径。**  
> resolve tenant → authorize membership/role → scoped query → audit。

## 不变量

- 每个租户作用域入口 **只** 经本生命周期；禁止业务层「假设已在正确租户」。  
- **顺序钉死**：先 [docs/auth](../auth/README.md) Session Gate（得 Subject）→ 再本 Gate；无 Subject → `UNAUTHENTICATED`（不进入租户步骤）。  
- 失败 **fail-closed**：禁止假成功；禁止未授权 scoped 写。  
- 超越：① 子域名/Host **不得**单独定租户（必须 Membership）；② Gate 成功后强制 RLS 上下文（§1=A）或等价 schema 切换（§1=B）。

## 步骤规格（编号钉死）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **前置：Session Gate** | 已注入 **Subject**；否则拒绝 `UNAUTHENTICATED`（401 / redirect），**不**继续。 |
| 2 | **Resolve tenant** | 从 INPUTS 策略取候选：路径 id/slug、头、子域名 Host、或会话「当前租户」。解析为 `tenant_id`；不存在 → `TENANT_NOT_FOUND`。多候选冲突（头≠子域名）→ `TENANT_MISMATCH`。 |
| 3 | **Authorize membership/role** | 查 `Membership(subject, tenant_id)` 且 `status=active`；否则 `NOT_A_MEMBER`。按路由所需 **Permission**（或最低 Role）检查；缺权 → `FORBIDDEN`。若启用计费且动作为写：BillingStatus ∉ 允许写集合 → `BILLING_INACTIVE`。 |
| 4 | **Scoped query** | 注入 **TenantContext**（tenant_id、membership、roles/permissions）。§1=A：`set_config('app.tenant_id', tenant_id, true)` 后执行业务 SQL/仓储；§1=B：切换 search_path/连接。业务层只经上下文访问，禁止另解 Host。 |
| 5 | **Audit** | 对 INPUTS 要求的动作（默认：成员/角色/权限变更、计费状态变更；可选：敏感读）追加 **AuditEvent**（who=subject、tenant_id、action、resource、at）。审计写失败策略：INPUTS 钉「阻断请求」或「记错误指标仍放行」；**默认：变更类阻断**。 |

可选：**绑定当前租户** — 步骤 3 成功后写入会话/Cookie（名 INPUTS）；下次 Resolve 可优先读绑定，**仍须**重做 Membership 校验（禁永久信任绑定）。

## 失败分类表

| 类 | 条件 | HTTP / 浏览器 | 备注 |
|----|------|---------------|------|
| `UNAUTHENTICATED` | 无 Subject | 401 / redirect 登录 | 未进租户步 |
| `TENANT_NOT_FOUND` | 候选无法解析为存在租户 | 404 | |
| `TENANT_MISMATCH` | 多信号不一致或客户端伪造他租 | 403 | |
| `NOT_A_MEMBER` | 无 active Membership | 403 | 有 Subject |
| `FORBIDDEN` | 成员但缺 Permission | 403 | |
| `BILLING_INACTIVE` | 计费状态不允许该写 | 402 或 403（INPUTS 钉一） | 无计费则 N/A |
| `AUDIT_FAILED` | 变更审计必写失败且策略=阻断 | 503 | 默认变更类 |

## 伪代码（非实现）

```text
tenantGate(req, requiredPermission):
  subject = req.subject          // from Session Gate
  if !subject → reject UNAUTHENTICATED

  candidate = resolveTenantCandidate(req)  // header | path | subdomain | session binding
  tenant = tenants.find(candidate)
  if !tenant → reject TENANT_NOT_FOUND
  if conflictingSignals(req) → reject TENANT_MISMATCH

  membership = memberships.find(subject, tenant.id, status=active)
  if !membership → reject NOT_A_MEMBER
  if !hasPermission(membership, requiredPermission) → reject FORBIDDEN
  if isWrite(req) && billingBlocksWrite(tenant) → reject BILLING_INACTIVE

  set_config('app.tenant_id', tenant.id, true)   // or schema-per switch
  inject(req, TenantContext{tenant, membership, permissions})

  result = business(req)
  if needsAudit(req) && !appendAudit(...) → reject AUDIT_FAILED
  return result
```

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 未登录访租户 API | 401；无业务成功体 |
| 已登录非成员 + 正确子域名 | 403 `NOT_A_MEMBER`；无业务数据 |
| 仅 Host 像租户但无 Membership | 拒绝；**不** scoped 成功 |
| 成员缺权 | 403 `FORBIDDEN` |
| 成员有权 | 注入 TenantContext；本租户数据 |
| 头与子域名指向不同租户 | 403 `TENANT_MISMATCH` |
| 写成功且需审计 | AuditEvent 落库 |
| 跨租户读 | 0 行 / 拒绝（与 `03` 一致） |
