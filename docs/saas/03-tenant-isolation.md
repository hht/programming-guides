# 03 — 租户隔离

## 不变量

- **默认（INPUTS §1=A）**：所有租户业务表含 `tenant_id`（FK → `tenants`）；`ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY`。  
- 每请求在进入 scoped query 前：`SELECT set_config('app.tenant_id', $1, true)`（对齐 [postgres/06](../postgres/06-rls-and-tenancy.md)）。  
- policy 使用 `current_setting('app.tenant_id', true)::uuid`（或 INPUTS 钉定类型）与行 `tenant_id` 比较。  
- **禁止**超级用户连接跑业务查询绕过 RLS（迁移/运维角色与应用角色分离）。  
- schema-per-tenant（§1=B）仅 INPUTS：须钉「连接选 schema / search_path」步骤；本文件默认节 N/A，见下方「schema-per」。

## 步骤规格（实现自写）— 共享 + RLS

1. **建表**：`tenants`；业务表一律 `tenant_id NOT NULL` + 索引 `(tenant_id, …)` 按查询。  
2. **迁移开 RLS**：每业务表 `ENABLE` + `FORCE`；为 SELECT/INSERT/UPDATE/DELETE 写 policy（默认拒绝，显式允许本租户）。  
3. **INSERT**：`WITH CHECK (tenant_id = current_setting(...))`；应用插入必须带当前租户 id，禁止客户端随意指定他租户。  
4. **请求入口**：Tenant Gate 成功后 SET `app.tenant_id`（事务/请求作用域 `true`）。  
5. **集成测**：租户 B 身份读租户 A → **0 行**；写 A → 失败或 0 影响行。

## schema-per-tenant（仅 INPUTS §1=B）

| 步骤 | 规格 |
|------|------|
| 1 | 每租户独立 schema（或库）；创建名与 `tenant_id`/`slug` 映射表在公共 schema。 |
| 2 | 请求解析租户后 `SET search_path` 或换连接；**仍须** Membership 校验。 |
| 3 | 迁移：对 N 租户可重复 apply 策略书面（滚动/模板）；运维成本自负。 |
| 4 | acceptance：跨 schema 泄漏探针仍必绿。 |

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 未 SET `app.tenant_id` 即查业务表 | 0 行或错误；**禁**全表可见（FORCE RLS） |
| 客户端提交他租 `tenant_id` | INSERT/UPDATE 被 policy 拒或应用先拒 `TENANT_MISMATCH` |
| §1=A 但未开 FORCE | **不合格**；须补迁移 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 租户 B 读 A 数据 | 0 行 |
| 租户 B 写 A 行 | 失败 / 0 行 |
| Gate 后 SET 正确租户 | 本租户行可见 |
| 缺 `app.tenant_id` | 不可见业务行（FORCE） |
