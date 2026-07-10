# 09 — 测试与 CI

## 单测（case → 期望）

| case | 期望 |
|------|------|
| 未知工具 | 无副作用 + `tool_denied` |
| 坏参 | `tool_invalid_args` |
| turn 触顶 | `budget_exceeded` |
| 终态缺字段 | `output_invalid` |
| domain 纯函数 | 确定性断言 |

## 发版矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | 金标 ok 路径 | `status=ok` 且 output 匹配 |
| 2 | 金标 error 路径 | `status=error` 且 error_code 匹配 |
| 3 | 金标触顶 | `budget_exceeded`；非假成功 |
| 4 | 无 API key 启动 | 非静默空跑 |
| 5 | 白名单外工具名 | 不执行 |
| 6 | `check` | 与 `commands.md` 的 `check` 一致（含 acceptance） |

## CI

PR：`check`（见 `commands.md`）。发版：`check-release`（=`check`+`eval`）。运维可观测参考，不进必勾。

## UI 状态

本品类默认 CLI/API：**N/A**（无页面三态矩阵）。
