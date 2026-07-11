# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

应用以 PostgreSQL 为权威源：约束进库、迁移演进、事务与 RLS 可测。

## 核心正确性路径（全文唯一）

迁移 / 事务 / RLS 见对应章；本册不另起第二路径名。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 能进库约束的不进应用碰运气 | 迁移/约束抽检 |
| F02 | MUST | 只通过迁移改 schema | `04` / CI |
| F03 | MUST | 跨表不变量同事务 | `05` 探针 |
| F04 | MUST | RLS 默认拒绝，policy 显式允许 | `06` |
| F05 | MUST NOT | 密钥入库 | env 抽检 |
| F06 | MUST | deletion-first；无 INPUTS 的表/能力不做 | INPUTS |

## SSOT

| 真相 | Owner |
|------|--------|
| 表结构 | `db/migrations/` |
| 连接 | INPUTS §2 |
| 事务行为 | `05` |
| 租户/RLS | `06` |

## 超越

1. `对照：B 中更弱/未见「CI 对空库强制 migrate apply」硬门闸 → 本指南要求（见 04）`
2. `对照：B 中更弱/未见「写路径事务失败必回滚探针」硬门闸 → 本指南要求（见 05）`
