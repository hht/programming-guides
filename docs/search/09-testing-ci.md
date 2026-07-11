# 09 — 测试与 CI

## 探针（case → 期望）

| case | 命令 | 期望 |
|------|------|------|
| INPUTS 谓词 | `check-inputs` | exit 0 |
| FTS 命中 / GIN | `test` | 已知文档可搜 |
| 无权限不泄漏 | `test` | 响应无该 id |
| 空命中 | `test` | `search.empty`，非 5xx |
| 写后可搜（按 §4 策略） | `test` | 同事务立即命中或 SLA 内命中 |
| 超长 query | `test` | validation，不查索引 |
| 向量（若启用） | `test` | scope + Top-K |
| 前端假搜索 | 架构/评审门禁 | 无「仅客户端 filter」充当搜索 API |

## 发版矩阵（场景 × 断言）

| # | 场景 | 断言 |
|---|------|------|
| 1 | 授权用户搜可见文档 | ≥1 hit，字段已 hydrate |
| 2 | 授权用户搜不可见文档词 | empty 或无该 id |
| 3 | 匿名 × 非公开实体 | `forbidden`（与 `05` / INPUTS §5 一致；不查索引） |
| 4 | 零命中词 | `search.empty` |
| 5 | 删除后搜 | 不命中 |
| 6 | 超时注入 | timeout/unavailable，非 empty |
| 7 | `check` | exit 0 |

PR：`check`。发版：同 + staging 对真实索引抽检 1.2.4。
