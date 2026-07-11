# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | Lifecycle 快乐路径 | create→verify→settled；收据可查 | 全 |
| 2 | 坏签 webhook | 状态不变；非 2xx 业务写 | 全 |
| 3 | 仅 client success | 不得 settled | 全 |
| 4 | failed 事件 | failed；无权益；失败可查 | 全 |
| 5 | 重复 settled 事件 | 幂等；副作用一次 | 全 |
| 6 | 幂等键冲突 | 按 INPUTS reject 或同 Intent | 全 |
| 7 | 金额不一致事件 | 拒 settle | 全 |
| 8 | 全额退款 | refunded；映射按 INPUTS | 全 |
| 9 | 非法状态边 | 转移拒绝 | 全 |
| 10 | Billing 映射（启用时） | settled→合法 BillingStatus | §10 启用 |
| 11 | Billing N/A | 无 Billing 写路径 | §10 N/A |
| 12 | 缺 webhook secret | 启动或首请求非静默成功 | 全 |
| 13 | float 金额 | 拒绝 | 全 |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | staging 提供商 test mode | create + 测试 webhook 验签通过 |
| 2 | Payment Intent Lifecycle 快乐路径 | 与单测 1 一致 |
| 3 | 故意坏签 | 单测 2 |
| 4 | 失败可见 + 收据 | 单测 4；settle 后收据 API 200 |
| 5 | saas 映射（若启用） | 单测 10；写门闸服从 saas `06` |
| 6 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
