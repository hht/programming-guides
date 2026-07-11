# 检索（Search）指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **全文检索**（+ 可选向量检索）：索引正确、查询可授权、空结果与错误可分。  
> **默认栈**：PostgreSQL **FTS**（`tsvector` + GIN）与 [postgres](../postgres/README.md) 对齐；**向量 = 可选 pgvector**（非默认必装）；规模触发后从 **{Elasticsearch, OpenSearch, Typesense, Meilisearch}** **钉死恰好一个**（未触发禁止引入）。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户对业务文档发检索请求，系统在**已授权可见范围**内返回相关命中；索引与源数据一致策略可验证；空结果 ≠ 系统错误。

## 核心正确性路径

**Search Query Lifecycle**（[05](./05-search-query-lifecycle.md)）：

`parse → authorize scope → query index → rank/hydrate → empty/error`

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. [03](./03-document-and-fts-index.md) / [04](./04-index-sync.md) / [05](./05-search-query-lifecycle.md)  
4. [06](./06-ranking-hydrate-empty.md) / [07](./07-vector-optional.md) / [08](./08-scale-out-engines.md)（07/08 按 INPUTS 勾选）  
5. [commands.md](./commands.md) `check` 绿  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md)  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-document-and-fts-index.md) | 可检索文档与 FTS 索引 |
| [04](./04-index-sync.md) | 写路径 → 索引一致 |
| [05](./05-search-query-lifecycle.md) | **Search Query Lifecycle** |
| [06](./06-ranking-hydrate-empty.md) | 排序、回填、空/错 |
| [07](./07-vector-optional.md) | 可选向量检索 |
| [08](./08-scale-out-engines.md) | 规模触发专用引擎 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / env 例 |
