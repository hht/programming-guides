# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| PostgreSQL 文档 | https://www.postgresql.org/docs/ |
| 事务 | https://www.postgresql.org/docs/current/tutorial-transactions.html |
| RLS | https://www.postgresql.org/docs/current/ddl-rowsecurity.html |
| Atlas | https://atlasgo.io/docs |

## 标杆 B

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 匹配 |
|----|------|------|--------|----------|------|
| A | [supabase/supabase](https://github.com/supabase/supabase) | P1 | PG+RLS 产品实践 | 整站抄业务 | 托管 PG 平台 |
| B | [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) | P1 | 迁移/类型 SQL | 绑死 TS | SQL 演进 |
| C | [launchbadge/sqlx](https://github.com/launchbadge/sqlx) | P1 | SQL 纪律 | 绑死 Rust | 查询正确性 |

## 共有

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 建模 | ✓ | ✓ | ✓ | 必做 |
| 迁移 | ✓ | ✓ | ✓ | 必做 |
| 事务 | ✓ | ✓ | ✓ | 必做 |
| 权限/RLS | ✓ | ✓ | — | 必做（C 映射可选） |
| 连接 | ✓ | ✓ | ✓ | 必做 |

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| CI 空库 migrate | A,B | 工程 | `04` | 必做/超越 |
| 事务回滚探针 | B,C | 工程 | `05` | 必做/超越 |
| RLS | A | 功能 | `06` | 按 INPUTS |

## 冲突

Prisma 迁移流行 → 本册 **Atlas+SQL**；TS 应用用 Drizzle 见 nextjs。
