# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。Provider 调用用 **fake/adapter stub**；禁 CI 打真实供应商（除非 INPUTS 书面 staging 沙箱 job）。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | Lifecycle 快乐路径 | compose→queued/submit→submitted→delivered | 全 |
| 2 | 缺变量 compose | `EMAIL_TEMPLATE_INVALID`；无出站 | 全 |
| 3 | 缺幂等键 | 拒绝 | 全 |
| 4 | 同键二次意图 | `EMAIL_DUPLICATE` | 全 |
| 5 | 重复 submit | provider 调用 = 1 | 全 |
| 6 | 业务回滚（异步） | 无 queued 消息 | 异步 |
| 7 | hard bounce | `bounced` + 抑制 | 全 |
| 8 | complaint | `complained` + 抑制 | 全 |
| 9 | 抑制后发送 | `EMAIL_SUPPRESSED` | 全 |
| 10 | Webhook 坏签名 | 状态不变 | 全 |
| 11 | 非法状态转移 | 拒绝 | 全 |
| 12 | 无 EMAIL_API_KEY（或钉名） | 启动非 0 | 全 |
| 13 | setTimeout 伪队列 | lint/审查红灯 | 全 |
| 14 | workers-queue 重试上限 | Job dead 且消息 `failed` 可查 | 异步 |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | staging 密钥/Webhook 成对配置存在（名） | 进程能读到名；值来自密钥管理 |
| 2 | Lifecycle 快乐路径（stub provider） | 与单测 1 一致 |
| 3 | 幂等双击/重试 | 单测 3–5 |
| 4 | bounce/complaint | 单测 7–10 |
| 5 | 异步（若勾选） | 单测 6、14；workers-queue 矩阵适用行 |
| 6 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
