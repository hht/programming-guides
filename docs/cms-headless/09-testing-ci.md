# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | Lifecycle 快乐路径 | draft→validate→publish→fetchPublished | 全 |
| 2 | validate 失败 | 不可 publish；Delivery 无新正文 | 全 |
| 3 | 仅 draft 时公开 fetch | 404 / NOT_PUBLISHED | 全 |
| 4 | preview 可见 draft | 仅 preview/鉴权路径 | 全 |
| 5 | 重复 publish | 幂等 | 全 |
| 6 | unpublish 后 Delivery | 404；缓存失效或 ≤TTL | 全 |
| 7 | 非法状态边 | 转移拒绝 | 全 |
| 8 | 投影缺必填 | 拒或不可当 published 消费 | 全 |
| 9 | 坏签 webhook（若启用） | 不误 purge | §9 webhook |
| 10 | 纯 TTL 无 webhook | 文档化延迟；超 TTL 不可见已撤回 | §9 TTL |
| 11 | 缺 Delivery token | 启动或首请求非静默成功 | 全 |
| 12 | 公开路径绑 preview token | 配置/测试红灯 | 全 |
| 13 | fake adapter 换商 | Lifecycle 单测仍绿 | 全 |
| 14 | fetchPublished 过滤 published（非仅「非 draft 参数」） | 从未发布的 draft 主行不得进公开响应 | 全 |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | staging Delivery 可读已发布样例 | fetchPublished 200 |
| 2 | Content Publish Lifecycle 快乐路径 | 与单测 1 一致 |
| 3 | 未发布 slug | 单测 3 |
| 4 | 校验失败不可上线 | 单测 2 |
| 5 | 撤回后公开不可见（契约内） | 单测 6 |
| 6 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
