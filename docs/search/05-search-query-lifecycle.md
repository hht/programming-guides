# 05 — Search Query Lifecycle（核心）

## 不变量

端到端唯一主路径（编号不可跳步、不可调换 2↔3）：

```text
1 parse → 2 authorize scope → 3 query index → 4 rank/hydrate → 5 empty/error
```

超越：① scope 先于查索引 + 泄漏探针；② empty/error 分码 + 发版矩阵。

## 步骤规格（实现自写）

### 1. parse

- 输入：原始用户字符串 + 可选 filters（类型、时间窗等，须在 INPUTS 白名单）。 
- 输出：`SearchQuery { text, filters, limit, cursor|offset, locale? }`。 
- 空白/`length > max`（默认 max **200** 字符，INPUTS 可改）：→ 步骤 5 `validation`。 
- 将 `text` 转为 `tsquery`：默认 `websearch_to_tsquery(config, text)`；空 tsquery → 步骤 5 `empty`（非 error）。 
- **禁**字符串拼进 SQL；参数绑定。

### 2. authorize scope

- 输入：认证主体（或匿名）+ `SearchQuery`。 
- 输出：`SearchScope` = 可安全下推的可见性谓词（`tenant_id = $1`、`visibility = public OR owner_id = $user` 等）。 
- 未登录且实体非公开 → **`forbidden`**（步骤 5），**不**查索引；此为匿名出口 SSOT（与 INPUTS §5 / `09` 一致；禁止改 empty）。 
- Scope 必须进入步骤 3 的查询（`WHERE` / RLS / 引擎 filter / scoped API key）；**禁止**「查全库再丢弃不可见 hit」作为唯一控制。

### 3. query index

- 在 `SearchScope` 内执行 FTS：`search_vector @@ query`（+ filters）。 
- `limit`/`offset|cursor` 按 INPUTS §6；默认 limit **20**，硬顶 **50**。 
- `SET LOCAL statement_timeout`（默认 **3s** 在线检索；INPUTS 可改）。 
- 超时/引擎不可用 → 步骤 5 `unavailable`/`timeout`。 
- 本步只取 **id + 排序信号**（rank / score），不把整行大字段当唯一真相展示。

### 4. rank/hydrate

- 排序：默认 `ts_rank_cd(search_vector, query) DESC`，其次主键稳定次序；细则见 `06`。 
- Hydrate：用命中 id **批量**读权威表（同 scope）；缺行（已删）→ 从结果剔除，不报 500。 
- 响应：`hits[]`（业务投影）+ 命中元数据：**默认 `total`**；若 INPUTS §6 改选则仅 `has_more`（互斥，禁止两者并行作契约）。

### 5. empty/error

| 出口 | HTTP/应用语义 | 何时 |
|------|----------------|------|
| `ok` + hits | 成功 | ≥1 命中 |
| `ok` + empty | 成功空 | 0 命中或空 tsquery；码 `search.empty` |
| `validation` | 4xx | 超长、非法 filter |
| `forbidden` | 403 | 无范围 |
| `timeout` / `unavailable` | 5xx 或 503 | 超时/引擎挂 |
| `internal` | 5xx | 未分类 |

## 伪代码（规格级，非业务实现）

```text
function search(raw, principal):
 q = parse(raw) # 1
 if q.invalid: return validation
 scope = authorize(principal, q) # 2
 if scope.denied: return forbidden
 ids = queryIndex(scope, q) # 3
 hits = rankHydrate(ids, scope, q) # 4
 if hits.length == 0: return empty # 5
 return ok(hits)
```

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 无权限文档在索引中存在 | 响应中**永不**出现其 id |
| 有权限文档 | 可命中 |
| 零命中 | `search.empty`，非 5xx |
| 超长 query | validation，不打索引 |
| 语句超时 | timeout 类，已开事务则回滚 |
| 步骤顺序被调换（静态审查/架构测试） | FAIL |
