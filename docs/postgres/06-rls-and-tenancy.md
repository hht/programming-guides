# 06 — RLS 与租户

## 不变量

- INPUTS §5=要：表 `ENABLE ROW LEVEL SECURITY` + `FORCE ROW LEVEL SECURITY`  
- 请求入口：`SELECT set_config('app.tenant_id', $1, true)`  
- policy 使用 `current_setting('app.tenant_id', true)`  

## 步骤

1. 迁移加 RLS + policies（SELECT/INSERT/UPDATE/DELETE）。  
2. 应用每请求 SET 租户。  
3. 集成测跨租户。  

## 无 RLS

INPUTS §5=不要 → 本文件 N/A；acceptance 写裁剪理由。

## 探针

| case | 期望 |
|------|------|
| 租户 B 读 A | 0 行 |
