# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。Runtime 用 **fake/stub**；禁 CI 下载巨型预训练权重（最小 stub artifact / 内存 fake）。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | Lifecycle 快乐路径 | authorize→validate→infer→respond；含钉死 artifact_version | 全 |
| 2 | 无凭证 | `unauthorized`；infer=0 | 全 |
| 3 | 非法 input | `validation_failed`；infer=0 | 全 |
| 4 | 超 body | `payload_too_large` | 全 |
| 5 | 超并发配额 | `quota_exceeded` | 全 |
| 6 | 超速率配额 | `quota_exceeded` | 全 |
| 7 | 错误 artifact_version | `model_mismatch`；infer=0 | 全 |
| 8 | runtime 超时 | `timeout`；无成功 output | 全 |
| 9 | runtime 不可用 | `unavailable` | 全 |
| 10 | 校验失败后配额可再获取 | 无槽位泄漏 | 全 |
| 11 | 配置仅 `latest` 无冻结 | 启动或 check-inputs 非 0 | 全 |
| 12 | 成功响应缺 artifact_version | 契约测试红灯 | 全 |
| 13 | 步骤顺序被绕过 | 架构/单测红灯 | 全 |
| 14 | 流式超时/截断 | 与 INPUTS §14 一致 | 仅流式 |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | staging/prod 成对：MODEL_ID、ARTIFACT_VERSION、密钥名、超时、配额 | 名存在；值来自密钥/配置管理 |
| 2 | Lifecycle 快乐路径（stub runtime） | 与单测 1 一致 |
| 3 | 未授权 / 校验失败 / 配额 | 单测 2–6 |
| 4 | 超时 | 单测 8 |
| 5 | 版本钉死 | 单测 7、11、12 |
| 6 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
