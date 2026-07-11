# 01 — 栈

| 层 | 选择 |
|----|------|
| 全文默认 | **PostgreSQL FTS**：`tsvector` + **GIN**；配置 = INPUTS §3；与 [postgres](../postgres/README.md) 同库同迁移纪律 |
| 迁移 | **Atlas** + `db/migrations`（见 postgres 册） |
| 向量 | **可选**：**pgvector**；默认**不装**；仅 INPUTS §10 勾选时启用 |
| 专用引擎 | **条件**：规模触发后从 **{Elasticsearch, OpenSearch, Typesense, Meilisearch}** **择一**（禁止「任选未勾」开口；未触发禁止引入） |
| 应用客户端 | 随应用册（SQL：go→pgx/sqlc；py→SQLAlchemy/asyncpg；ts→Drizzle） |

禁止：

- 「ILIKE 全表扫」或「前端 filter」冒充全文检索 
- 未勾选向量却引入嵌入管线 
- 未达规模触发却默认装 ES/OpenSearch/Typesense/Meilisearch「以后用得上」

## 脚手架

```bash
# 1) 对齐 postgres：compose 起库 + atlas migrate apply
# 2) 迁移中：可检索列 → generated tsvector 或触发器维护；CREATE INDEX ... USING gin (search_vector)
# 3) （可选）CREATE EXTENSION vector; — 仅 INPUTS §10
# 4) （条件）专用引擎：按 08 与厂商文档；本册不作默认厂商直至 §11 触发
```

版本：PostgreSQL **≥16**（与 postgres 册一致）；pgvector 取与 PG 大版本兼容的稳定版。
