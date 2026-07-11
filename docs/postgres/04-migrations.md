# 04 — 迁移

## 不变量

- 只通过 `db/migrations` 变更 
- CI：空库 `atlas migrate apply` **必须** exit 0 
- DROP/缩列：两阶段（先停写→再删）；单 PR 禁止无计划 destructive 

## 步骤

1. 新增迁移 SQL。 
2. `atlas migrate hash`。 
3. 本地 apply + 应用测。 
4. staging → prod。 

## 探针

| case | 期望 |
|------|------|
| 空库 apply | 0 |
| 已 apply 再 apply | 0（无漂移） |
