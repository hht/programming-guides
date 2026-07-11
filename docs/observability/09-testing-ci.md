# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | Resource `service.name` | = INPUTS | 合法裁剪（恒含 logs+traces） |
| 2 | 无头入站 | 生成 correlation_id | 同上 |
| 3 | 入站带 X-Correlation-Id | 出站/日志同值 | 同上 |
| 4 | JSON 日志 | 可 parse；含 correlation_id | logs（默认必勾） |
| 5 | 错误日志无 token | 红线字段不存在 | logs |
| 6 | metric 登记外打点 | 失败/禁止 | metrics（可选） |
| 7 | 高基数 label | 拒绝 | metrics |
| 8 | 错误 span status | Error | traces（默认必勾） |
| 9 | 日志 trace_id == span | 同请求一致 | logs+traces |
| 10 | 出站 inject | 含 traceparent 或相关头 | traces 或跨服务 |
| 11 | 故意 5xx | 响应含 id（§7）；日志可查同 id | logs（≡ sources / `11`§B / `05`） |
| 12 | 无 OTLP endpoint（勾 traces） | 启动非 0 | traces |
| 13 | 「仅 SaaS DSN」/「仅 metrics」冒充完成 | **不得**使 05/11B 变绿 | 合法裁剪 |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | staging 发一成功请求 | 日志含 correlation_id + service |
| 2 | 故意错误请求 | 对外可持有 id；日志命中同 id |
| 3 | logs+traces | 同请求 trace_id 一致 |
| 4 | metrics（若启用） | 登记表内指标有增量；无高基数爆炸 |
| 5 | OTLP（若 traces/metrics） | collector/后端收到导出（或测试 stub 断言 exporter 调用） |
| 6 | 查询钩子（若 §13） | runbook 模板用 correlation_id 或 trace_id 可演示 |
| 7 | 后端可换烟测 | 只改 endpoint 仍满足 1–2（不绑品牌） |
| 8 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
