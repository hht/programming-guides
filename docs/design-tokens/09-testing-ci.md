# 09 — 测试与 CI

指南**不附**可运行测试源码；实现仓按表自写。

## 单测探针（case → 期望）

| # | case | 期望 | 适用 |
|---|------|------|------|
| 1 | Lifecycle 快乐路径 | 改 DTCG semantic → build → 产物变 → UI 绑语义可见 | 全 |
| 2 | 源非 DTCG / 断链 alias | build 非 0 | 全 |
| 3 | 产物被手改 | `tokens:check-drift` 非 0 | 全 |
| 4 | 组件出现禁色名（第二套） | lint/check 非 0 | 全 |
| 5 | 组件出现裸品牌 hex | lint/check 非 0 | 全 |
| 6 | dark 模式 | 同名变量；无平行 `*-dark` 消费名 | §6=light+dark |
| 7 | Figma/tokens.md 路径漂移 | check 非 0 | §7=启用 ui-ux |
| 8 | 未勾选平台无产物 | 无 ios/android 文件 | 按 §5 |
| 9 | 对比抽检（可选自动化） | fg on bg ≥4.5:1 | §16 未裁剪 |
| 10 | `check` 聚合 | exit 0 | 全 |

## 发版场景 × 断言矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | 源可解析 + build | 单测 1–2 |
| 2 | drift 干净 | 单测 3 |
| 3 | 消费禁令 | 单测 4–5 |
| 4 | 主题（若启用） | 单测 6 |
| 5 | ui-ux 对位（若启用） | 单测 7 |
| 6 | `check` | exit 0 |

PR：`check`。发版：同 + 矩阵适用行。
