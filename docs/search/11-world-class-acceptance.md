# 11 — 世界级验收

## A. 工程面（元指南 §1.2）

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | `02` Pass1 业务词表 + Pass2 语法 |
| 风格 | [ ] | `00` 框架 MUST；显式 SQL/参数绑定 |
| 工具链 | [ ] | PG16+ FTS + Atlas（`01`） |
| 门禁 | [ ] | `commands.md` |
| 极简 | [ ] | 指南无业务实现；deletion-first |
| 可测 | [ ] | `09` 探针表 |
| 关键路径 | [ ] | `05` 五步 |
| 测试 | [ ] | `09` 场景×断言 |
| 安全 | [ ] | authorize scope + 泄漏探针 |
| 性能 | [ ] | statement_timeout；limit 硬顶 |
| 无障碍/性能预算 | [ ] | 在线检索 timeout 默认 3s；或 `裁剪：理由` |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有（≥2 证据源）

| 能力 | sources | 勾选 |
|------|---------|------|
| 全文检索可检索文档 | https://github.com/typesense/typesense · https://github.com/meilisearch/meilisearch · https://www.postgresql.org/docs/current/textsearch.html | [ ] |
| 查询时可见性/过滤范围 | https://github.com/discourse/discourse · https://github.com/typesense/typesense · https://github.com/meilisearch/meilisearch | [ ] |
| 相关度排序 | https://github.com/typesense/typesense · https://github.com/meilisearch/meilisearch · https://www.postgresql.org/docs/current/textsearch-controls.html | [ ] |
| 空结果可区分于故障 | https://github.com/discourse/discourse · https://github.com/meilisearch/meilisearch | [ ] |
| 新可搜字段上线后可命中 | https://github.com/typesense/typesense · https://github.com/meilisearch/meilisearch · https://github.com/discourse/discourse | [ ] |

## C. §1.3 判定复制

1. [ ] 能力切条（上表每行 = 用户可感知能力） 
2. [ ] 共有判定：能力在 \(B\) = {Typesense, Meilisearch, Discourse} 中 ≥2 源出现；仅 1 源 → 可选 
3. [ ] 功能面达到：必做 ⊇ 所有共有 
4. [ ] 工程面（A）勾选 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「authorize 必须在 query index 之前且不可靠事后滤 id」硬门闸 → 本指南要求 scope 谓词进入查询或等价 scoped token，并有泄漏探针（见 05）` 
 - [ ] a2. `对照：B 中更弱/未见「空命中与系统错误强制分码 + 发版矩阵」→ 本指南要求 empty/error 分码与场景×断言（见 06、09）` 
 - [ ] b. `09` 发版矩阵 1–7 
 - [ ] c. N/A（证据源含开源仓）

## D. 品类禁令

- [ ] 无「前端 filter 假搜索」冒充实现 
- [ ] 未规模触发不引入 ES/OpenSearch/Typesense/Meilisearch；触发后从四者择一 
- [ ] 向量为可选，未勾选不装 
