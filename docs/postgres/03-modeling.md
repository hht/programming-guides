# 03 — 建模

## 不变量

- 每表主键；FK 显式 `ON DELETE` 行为写明（默认 `RESTRICT`） 
- 钱：按 INPUTS §11（`bigint` 或 `numeric(p,s)`） 
- 时间：`timestamptz` 

## 步骤

1. 实体→表；写不变量。 
2. PK/FK/UNIQUE/CHECK。 
3. 索引：有慢查询证据再加。 

## 探针

| case | 期望 |
|------|------|
| 重复 UNIQUE | SQLSTATE 23505 |
| 缺 FK 父行 | 23503 |
