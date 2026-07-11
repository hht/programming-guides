# 11 — 世界级验收

## A. 工程面（§1.2）

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录 | [ ] | `02` |
| 命名 / 词表 | [ ] | `02` Pass1 表/列业务名 + snake 语法 |
| 风格 | [ ] | SQL 显式 |
| 工具链 | [ ] | PG16+Atlas |
| 门禁 | [ ] | `commands` |
| 极简 | [ ] | 无业务堆 |
| 可测 | [ ] | `09` |
| 关键路径 | [ ] | `05` |
| 测试 | [ ] | `09` |
| 安全 | [ ] | RLS/密钥 |
| 性能 | [ ] | statement_timeout |
| 运维 APM | N/A | |

## B. 功能共有

| 能力 | sources | 勾选 |
|------|---------|------|
| 关系建模 | https://www.postgresql.org/docs/ · https://github.com/supabase/supabase | [ ] |
| 迁移 | https://github.com/supabase/supabase · https://github.com/drizzle-team/drizzle-orm | [ ] |
| 事务 | https://www.postgresql.org/docs/current/tutorial-transactions.html · https://github.com/drizzle-team/drizzle-orm | [ ] |
| RLS/权限 | https://www.postgresql.org/docs/current/ddl-rowsecurity.html · https://github.com/supabase/supabase | [ ] |
| 连接配置 | https://github.com/supabase/supabase · https://www.postgresql.org/docs/ | [ ] |

## C. §1.3

1. [ ] 能力切条  
2. [ ] 共有 ≥2 源  
3. [ ] 功能 ⊇ 共有  
4. [ ] 工程面勾选  
5. [ ] 超越 a+b：  
   - [ ] a1. CI 空库 migrate 硬门闸（`04`）  
   - [ ] a2. 写路径事务回滚探针（`05`）  
   - [ ] b. `09` 矩阵 1–6  
   - c. N/A  
