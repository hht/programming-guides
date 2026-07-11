# 03 — 可检索文档与 FTS 索引

## 不变量

- 每个可检索实体有明确 **Searchable Document** 投影（字段 ⊆ INPUTS §1）。 
- 全文默认存 **`tsvector`**，**GIN** 索引；查询用同配置的 `tsquery`（`plainto_tsquery` / `websearch_to_tsquery` 由 INPUTS 选定一种，默认 **`websearch_to_tsquery`**）。 
- `LIKE`/`ILIKE`/`~` 仅作辅助过滤，**不得**单独承担全文能力。 
- 权重：`setweight` A/B/C/D 映射到标题/正文等，须在迁移或文档表写清。

## 步骤规格（实现自写）

1. 从 INPUTS §1 列出实体 → 表/列；标记可检索 vs 仅展示。 
2. 增加 `search_vector tsvector`（生成列或触发器维护，与 `04` 同步策略一致）。 
3. `CREATE INDEX ... ON <table> USING gin (search_vector);` 
4. `default_text_search_config` / 显式 `regconfig` = INPUTS §3；索引与查询同一配置。 
5. 多字段拼接用 `coalesce`，避免 NULL 吞掉整文档（P0：PG FTS 文档）。 
6. 若启用专用引擎（`08`）：集合 schema 与 PG 字段映射表写入仓内（非本指南实现）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 未声明可检索字段 | 停：INPUTS 不完整 |
| 配置名在库中不存在 | migrate/启动失败，非运行时静默回退 `simple` |
| 仅建 btree 无 GIN | **不合格**（验收 FAIL） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 词干/配置一致（同 config 索引与查询） | 已知文档可命中 |
| 停用词按配置 | 不产生无效必中 |
| `EXPLAIN` 命中 GIN（测试库 fixture） | 计划含 Bitmap/GIN 路径（或等价） |
