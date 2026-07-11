# 来源与差距

## 品类

检索边界：全文搜索 +（可选）向量检索；索引与查询正确性，**非** ML 训练百科。

核心路径：**Search Query Lifecycle**。

## P0（≥3）

| 主题 | URL |
|------|-----|
| PostgreSQL Full Text Search | https://www.postgresql.org/docs/current/textsearch.html |
| FTS 控制与排序 | https://www.postgresql.org/docs/current/textsearch-controls.html |
| GIN 索引 | https://www.postgresql.org/docs/current/gin.html |
| pgvector（可选） | https://github.com/pgvector/pgvector |

## 标杆 B（3 开源）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [typesense/typesense](https://github.com/typesense/typesense) | P1 | 集合 schema、scoped key、typo/相关度、空结果 API 形态 | 默认替换 PG；把整引擎当唯一 SSOT | 专用检索引擎的查询与权限边界 |
| B | [meilisearch/meilisearch](https://github.com/meilisearch/meilisearch) | P1 | searchable attributes、tenant token、索引设置演进 | 未触发规模就引入；绑死其 DSL | 应用级搜索 API 与多租户过滤 |
| C | [discourse/discourse](https://github.com/discourse/discourse) | P1 | 应用内搜索与权限/可见性结合、空态与查询体验 | 抄论坛业务域；绑死 Ruby | 业务系统内「可搜且授权」 |

未入选：[outline/outline](https://github.com/outline/outline) — 同品类知识库搜索，与 B/C 重叠；本册以 Discourse 覆盖「应用内授权搜索」。

## 共有能力

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 全文检索文档 | ✓ | ✓ | ✓ | 必做 |
| 查询范围/过滤/可见性 | ✓ | ✓ | ✓ | 必做 |
| 相关度排序 | ✓ | ✓ | ✓ | 必做 |
| 空结果可处理 | ✓ | ✓ | ✓ | 必做 |
| 新可搜字段上线后可命中 | ✓ | ✓ | ✓ | 必做 |
| 内置 typo tolerance | ✓ | ✓ | — | 可选（规模/引擎触发） |
| 向量/语义 | ✓（产品线） | ✓（混合） | — | 可选（`07`） |

## 差距表

| 缺口 | 来自 | 类型 | 落入文件 | 必做/可选/参考 |
|------|------|------|----------|----------------|
| FTS + GIN 默认栈 | P0 | 工程 | `01` `03` | 必做 |
| 写后索引一致 | A,B,C | 工程 | `04` | 必做 |
| Search Query Lifecycle | A,B,C | 功能/工程 | `05` | 必做 |
| authorize 先于 query + 泄漏探针 | C,A,B | 安全 | `05` | 必做/超越 |
| empty≠error 分码 | A,B,C | 工程 | `06` `09` | 必做/超越 |
| 向量 | A,B | 功能 | `07` | 可选 |
| 专用引擎规模门闸 | A,B | 工程 | `08` | 条件必做 |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| Typesense/Meilisearch 流行作默认引擎 vs PG FTS | **默认 PG FTS**（与 postgres 册同库、少移动部件）；专用引擎仅 §11 规模触发 |
| 向量作默认卖点 vs 品类边界 | **可选 pgvector**；禁训练百科 |
| ILIKE / 前端 filter 实现成本低 | **禁止**冒充搜索 |
| Outline vs Discourse 第三标杆 | 选 **Discourse**（应用内授权搜索证据更贴合默认栈） |
