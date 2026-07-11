# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | 快乐路径 Lifecycle | trigger→handler→response；触发表 status | 全 |
| 2 | cold 与 warm 同输入 | 业务结果一致 | 全 |
| 3 | 写缺幂等键 | VALIDATION | 有写路径 |
| 4 | 同幂等键重放 | 副作用 ×1 | 有写路径 |
| 5 | 模拟超时 | TIMEOUT / 504 | 全 |
| 6 | 未知路由 | NOT_FOUND / 404 | HTTP |
| 7 | 未捕获异常 | INTERNAL + internal error | 全 |
| 8 | 缺必填 env/secret | 启动或请求非成功 | 全 |
| 9 | 异步 transient 至上限 | 停止无限重试 | 有异步触发 |
| 10 | permanent 不重试 | 立即失败 | 有异步触发 |
| 11 | 平台互斥配置 | 双默认配置 CI 红灯 | 全 |
| 12 | 响应无密钥泄漏 | body/头无 secret | 全 |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | 本地/预览 invoke | 与单测 1 一致 |
| 2 | staging 部署后 HTTP 触发表路径 | 2xx 或约定业务失败码（非 5xx 配置错误） |
| 3 | 超时预算 | 单测 5 |
| 4 | 幂等写 | 单测 3–4 |
| 5 | cold/warm | 单测 2 |
| 6 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
