# 08 — 审计与跨册边界

## 不变量

- **AuditEvent** 最小字段：`id`、`at`、`subject`、`tenant_id`（平台超管跨租户可空或填目标租户）、`action`、`resource_type`、`resource_id`（可空）、`meta`（可空 JSON）。  
- 默认必审计：成员邀请/接受/撤销、角色变更、权限集变更、计费状态转移。  
- **本册 = 多租户 SSOT**；auth / postgres / 应用册冲突时改引用，不平行第二套租户语义。

## 审计步骤规格

1. Tenant Gate 步骤 5：变更类动作在同一请求事务内 `appendAudit`（与业务写同事务；失败回滚）。  
2. 异步投递（若用）不得成为「唯一」真相除非有 outbox；默认同步同事务。  
3. 审计表本身 RLS：仅本租户 admin 可读；平台超管另策并审计其读。

## 跨册边界表

| 关切 | 本册（saas） | 其它册 |
|------|--------------|--------|
| Subject / Cookie / Session Gate | 引用 | **auth** SSOT |
| `tenant_id` 列、RLS、`app.tenant_id` | 本册 `03` + 引用 | **postgres** `06` 机制 SSOT |
| Tenant Gate 步骤 / RBAC / 计费门闸 | **SSOT** | 应用册只接线 |
| 支付商 webhook 验签百科 | 边界 + 状态机 | 未来 **payments**；未齐套前最小实现仍服从 `06` |
| UI 样式 | 不写 | ui-ux / 应用册 |

## 对接要点（实现自写）

### nextjs / react

- Middleware 或 loader：Session → Tenant；RSC 禁止信任仅 URL 段无 Gate。  

### go / fastapi

- 中间件/Depends 链顺序钉死；OpenAPI security 含会话；租户参数进路径或头并文档化。

## 禁止

- 应用册另钉「默认无 RLS、只靠前端切换租户」。  
- 审计可篡改无追加约束（应用角色 UPDATE audit 行）。

## 单测探针

| case | 期望 |
|------|------|
| 撤销成员 | 有 AuditEvent；再访 403 |
| 计费状态变更 | 有 AuditEvent |
| 应用文档 | 含指向 `docs/saas` 的引用 |
