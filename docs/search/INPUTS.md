# INPUTS — 缺则停

| # | 项 | 验收 |
|---|-----|------|
| 1 | **可检索实体清单** | 每实体：业务名、主键、可检索字段、不可检索字段、可见性规则一句 |
| 2 | **全文引擎** | 默认 □ **PostgreSQL FTS**（须勾）；换专用引擎 **仅**当 §11 规模触发后从四者钉死恰好一个 |
| 3 | **文本搜索配置** | `regconfig` 名（例 `english` / `simple`）或自定义配置名；与 `to_tsvector`/`to_tsquery` 一致 |
| 4 | **索引同步策略** | □ 同事务触发器/生成列 □ 应用双写同事务 □ 异步 outbox（须写 **可见延迟 SLA** 秒） |
| 5 | **授权范围** | □ 行级可见（tenant/owner/role）□ 公开只读；与 auth/会话策略对齐；**禁止**「搜完再滤」作为唯一门闸；**匿名 × 非公开实体 → 唯一出口 `forbidden`（与 `05`/`09` 一致；禁止改 empty）** |
| 6 | **分页与结果元数据** | 默认 `limit`（≤50）+ □ `offset` 或 □ cursor；最大 `limit` 数字；**命中元数据互斥：□ `total`（默认）□ 仅 `has_more`（钉一种）**；**稳定次序次键互斥：□ `rank DESC, id ASC`（默认）□ `rank DESC, created_at DESC, id ASC`（钉一种）** |
| 7 | **空结果文案/码** | 业务空命中码（例 `search.empty`）≠ 系统错误码 |
| 8 | **环境成对** | staging/prod `DATABASE_URL`（及若启用专用引擎的 URL）名成对；值不入库 |
| 9 | **应用册** | go / fastapi / nextjs / react / `N/A` |
| 10 | **向量检索** | □ 不做（默认）□ 做：pgvector + 嵌入模型名 + 维度 + 相似度度量（`cosine`/`l2`/`ip`） |
| 11 | **规模触发** | 文档量/QPS/多语言/typo 需求表；未达阈值 → **禁止**引入 ES/OpenSearch/Typesense/Meilisearch；达阈值 → 从四者中 **勾选恰好一个** 并写切换理由 |
| 12 | **设计/API** | 搜索 frame 或等价 UI 状态；请求/响应字段对齐 `templates/*.schema.json`；**HTTP 路径互斥：□ `/search/<entity>`（默认）□ 单一 `/search` + `type` 枚举（钉一种）** |

缺任一项谓词 → 停写。全部满足后输出：

```text
INPUTS OK
```
