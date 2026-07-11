# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

类型安全检索：真检索来自索引；先授权再查；空命中≠错误。

## 核心正确性路径（全文唯一）

**Search Query Lifecycle**：authorize scope → query index → hydrate → respond。规格见 [05](./05-search-query-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 命中来自索引查询 | `05` |
| F02 | MUST NOT | 前端对已加载列表 filter 冒充搜索 | `11` |
| F03 | MUST | authorize scope 在 query index 之前 | `05` |
| F04 | MUST | 展示字段从权威源 hydrate | `05`/`06` |
| F05 | MUST | 零命中是成功路径；失败分码 | `06` |
| F06 | MUST | 同步策略显式 | INPUTS |
| F07 | MUST NOT | 无证据引入第二检索引擎 | `08` |
| F08 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 可检索字段与权重 | INPUTS §1 + `03` |
| FTS schema / 迁移 | [postgres](../postgres/README.md) |
| 查询生命周期 | `05` |
| 可见性谓词 | INPUTS §5 + auth |
| 向量（若启用） | INPUTS §10 + `07` |
| 专用引擎（若触发） | INPUTS §11 + `08` |

## 超越

1. `对照：B 中更弱/未见「authorize 必须在 query index 之前」硬门闸 → 本指南要求（见 05）`
2. `对照：B 中更弱/未见「空命中与系统错误强制分码」→ 本指南要求（见 06、09）`
