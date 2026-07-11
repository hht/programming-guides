# 08 — 规模触发与专用引擎

> **默认不启用。** 仅当 INPUTS §11 规模触发后，从 **{Elasticsearch, OpenSearch, Typesense, Meilisearch}** **钉死恰好一个**厂商与版本策略。

## 触发条件（须满足 ≥1 且写入 INPUTS 数字）

| 信号 | 默认阈值（可改，须写数） |
|------|--------------------------|
| 可检索文档量 | ≥ **5_000_000** 行或 PG FTS p95 > INPUTS 延迟预算 |
| 查询 QPS | 在线检索 P95 预算无法用垂直扩展+合理索引满足 |
| 产品硬需求 | typo tolerance / 多语言分面等 **PG FTS 无法达标** 且有验收数字 |

未触发 → 引入专用引擎 = acceptance **FAIL**。

## 不变量

- PG（或原权威库）仍为**业务真相**；引擎为派生索引。  
- 同步走 `04` 异步/outbox；禁只写引擎。  
- 查询仍服从 `05`：parse → authorize → query → rank/hydrate → empty/error。  
- Scoped API key / tenant token / filter 下推 = authorize 的等价实现，须有泄漏探针。

## 步骤规格（实现自写）

1. INPUTS §11 勾选引擎并写切换理由 + 回滚条件（何时退回纯 PG）。  
2. 集合/索引 schema ↔ Searchable Document 映射表。  
3. Indexer：outbox 消费 → upsert/delete；幂等。  
4. Query：客户端打引擎；hydrate 仍回权威库。  
5. 双跑期（可选）：影子流量对比 Top-K 重叠率；门槛由 INPUTS 给（默认重叠率监控为参考，不进必勾）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 引擎挂 | `unavailable`；INPUTS 决定是否 fallback PG FTS（默认 **是**，若 PG 索引仍维护） |
| schema 漂移 | 部署门禁 FAIL |
| 未授权 filter 漏建 | 安全 FAIL |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 删除权威行后 | 引擎文档删除或不可搜（SLA 内） |
| scoped 查询 | 无跨租户 hit |
| fallback（若启用） | 引擎挂时 PG 路径仍 empty/ok 可分 |
