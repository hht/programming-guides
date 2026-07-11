# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | 合法 command Lifecycle | `Ok`；副作用 1 次 | 全 |
| 2 | 校验失败 | `VALIDATION_FAILED`；副作用 0 | 全 |
| 3 | 未声明 command 名 | 前端/层拒绝；副作用 0 | 全（超越②） |
| 4 | allowlist ⊆ handler ⊆ 登记表 | 集合相等 | 全 |
| 5 | 无 fs capability 调 fs | 拒绝 | capability |
| 6 | 最小 permissions 回归 | 合法 invoke 仍通 | capability |
| 7 | 错误码映射 | `AppError` → 前端 `code` | 全 |
| 8 | 非 Tauri 环境 CTA | 不假成功 | 壳 |
| 9 | 敏感事件 payload | 无密钥字段 | 若有事件 |
| 10 | 受保护 command 无主体 | `FORBIDDEN`/`UNAUTHENTICATED` | 若鉴权 |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | `tauri build`（INPUTS 勾选 OS） | 产物生成；identifier 正确 |
| 2 | Command Lifecycle 主路径 | 与单测 1–2 一致 |
| 3 | 未声明 command | 单测 3 |
| 4 | Capability 收紧抽样 | 单测 5–6 |
| 5 | Allowlist 三方一致 | 单测 4 |
| 6 | 更新（若启用） | 验签失败不崩 |
| 7 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用 OS 行。

## CI 何时

| 触发 | 命令 |
|------|------|
| PR | `check`（含 inputs + 单测适用行 + acceptance A+B+D 自检） |
| 发版 tag | `check` + `test:e2e-desktop`（矩阵） |
