# 06 — RLS 与租户

## 不变量

- INPUTS §5=要：租户表 `ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY`。  
- 应用角色 = INPUTS §5b（默认 `app`）：**无** `BYPASSRLS`、**不是**表 owner（否则 FORCE 被绕过）。  
- 请求入口（同事务、业务 DML 前）：`SELECT set_config('app.tenant_id', $1, true)`；`$1` 为当前租户 id 的文本形式。  
- `tenant_id` 列类型默认 **uuid**（INPUTS §4）；`set_config` 始终传 **text**，policy 内转换。

## 步骤（钉死）

1. 迁移（owner / `DATABASE_URL_MIGRATE`）：对 INPUTS §1 标 **`tenant`** 的每张表 `ENABLE` + `FORCE` RLS（**不对** `global` 表开 RLS）。  
2. 最小 policy（四权可用一条 `FOR ALL`，谓词不可弱）：

```sql
-- 例：orders；tenant_id uuid
CREATE POLICY orders_tenant_all ON orders
  FOR ALL TO app
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
```

3. `GRANT SELECT, INSERT, UPDATE, DELETE ON <tables> TO app`（按需）；序列/用法同。  
4. 应用每请求：鉴权后 `set_config` → 再 DML（见 `05` 步骤 3）。  
5. 集成测：租户 B 会话读 A → 0 行。

## 无 RLS

INPUTS §5=不要 → 本文件 N/A；acceptance 写裁剪理由。

## 探针

| case | 期望 |
|------|------|
| 租户 B 读 A | 0 行 |
| 未 set_config 即以 `app` 写 | 失败或 0 行；不得写入他租户 |
| 表 owner 直连绕过 | **禁止**作应用默认路径；测仅用 `app` 角色 |
