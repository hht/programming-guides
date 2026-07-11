# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | 快乐路径 Lifecycle | enqueue→claim→execute→ack → succeeded | 全 |
| 2 | 业务回滚 | 无 pending Job（PG 同事务） | PG |
| 3 | 缺幂等键 | 入队拒绝 | 全 |
| 4 | 同键二次入队 | `JOB_DUPLICATE`（默认） | 全 |
| 5 | 双 Worker claim | 同一 Job 仅一方持有 | 全 |
| 6 | 可见性超时重 claim | 未 ack 到期后可再 claim | 全 |
| 7 | 重复 execute 同键 | 副作用计数 = 1 | 全 |
| 8 | transient 至上限 | state=dead；可查 last_error | 全 |
| 9 | permanent | 立即 dead | 全 |
| 10 | 退避间隔 | 符合 INPUTS 公式 | 全 |
| 11 | 非持有者 ack | `JOB_NOT_CLAIMED`（默认） | 全 |
| 12 | 无 DATABASE_URL/REDIS_URL | 启动非 0 | 全 |
| 13 | setTimeout 伪队列 | lint/审查红灯或测试禁路径 | 全 |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | Compose/staging 存储可达 | PG 可连或 Redis PING |
| 2 | Job Lifecycle 快乐路径 | 与单测 1 一致 |
| 3 | 崩溃 / 超时未 ack | 另一 Worker 最终执行且幂等 |
| 4 | 重试与死信 | 单测 8–10 |
| 5 | 幂等入队+执行 | 单测 3–4、7 |
| 6 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
