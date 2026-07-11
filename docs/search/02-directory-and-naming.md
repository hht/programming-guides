# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
db/
 migrations/ # FTS 列/索引/触发器；唯一 schema SSOT（postgres）
src/ # 或应用册约定根
 features/
 <entity>-search/ # 按可检索实体分目录，禁 search-utils 大口袋
 parse-query.ts|go|py # 步骤 1：解析用户查询 → 结构化 SearchQuery
 authorize-scope.* # 步骤 2：可见性谓词
 query-index.* # 步骤 3：打索引
 rank-hydrate.* # 步骤 4
 search-errors.* # 步骤 5 错误码
 # 可选 outbox / indexer worker（异步同步时）
```

依赖方向：`parse → authorize → query → rank/hydrate`；禁 UI 直连 SQL/`@@`；禁 features 互相倒依赖。

UI 状态（若有搜索框）：至少 `idle | typing | loading | results | empty | error`；矩阵见应用 UI 册或本仓 `templates` 状态说明。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **实体 + 检索动作** = 目录与函数词根：`documentSearch`、`topicSearch`，禁 `SearchManager`、`handleSearch`、`SearchService`、`*Dto`。 
3. 协议字段冻结：`query`、`scope`、`hits`、命中元数据（**默认 `total`**；或 INPUTS §6 的仅 `has_more`）、`empty_reason`（若用）与词表一致。 
4. 一词一义：`hit` ≠ `document`（hit = 检索命中投影；document = 权威实体）。

| 概念 | 正例 | 反例 |
|------|------|------|
| 能力目录 | `features/topic-search/` | `features/search-manager/` |
| 解析 | `parseSearchQuery` | `handleQuery` / `processInput` |
| 命中 | `SearchHit` | `SearchResultDto` / `HitEntity` |
| 向量列（若启用） | `embedding` + 实体前缀 | `vec` / `data` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| TS/Go 导出 | `camelCase` 函数；类型 `PascalCase` |
| SQL 列 | `snake_case`；FTS 列默认 `search_vector`（词表可改但全局唯一） |
| 错误码 | `search.<case>` kebab/dot，与 INPUTS §7 对齐 |
| HTTP 路径 | **默认** `/search/<entity>`；或 INPUTS §12 改选单一 `/search` + `type` 枚举（互斥，选定一种） |
