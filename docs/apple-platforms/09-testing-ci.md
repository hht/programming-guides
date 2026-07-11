# 09 — 测试与 CI

> 指南不附可运行测试源码；实现仓自写。

## 单测（case → 期望）

| case | 期望 |
|------|------|
| load 成功非空 | success + Model |
| load 成功空 | empty |
| load NETWORK | error + Retry 可恢复 |
| 双 submit | 仅一次副作用 |
| 取消 in-flight | CANCELLED；无迟到写回 |
| 派生 `isSubmitDisabled` | 给定相位断言 |
| Route push/pop | path 变化 |
| 错误码映射 | API 状态 → INPUTS §9 类 |
| Worker 离主线程 | 重活不在 MainActor（隔离/expectation） |
| UI 回写 MainActor | 赋值方法 MainActor 隔离 |

## 发版矩阵

| # | 场景 | 断言 | 适用 |
|---|------|------|------|
| 1 | 冷启动主 Screen | 矩阵 `loading→success\|empty\|error` 之一诚实出现 | 全 |
| 2 | 主写路径 Submit | submitting → 成功可见结果或 error；无假成功 | 全 |
| 3 | 失败 Retry | 从 error 恢复成功 | 全 |
| 4 | 离开屏取消加载 | 无崩溃；无错误轰炸；返回可再 load | 全 |
| 5 | 导航往返 | push 详情 pop 回列表态正确 | 全 |
| 6 | Mac 菜单主命令 | 与按钮同一结果（窗内可见） | **仅**目标含 Mac |
| 7 | Mac 快捷键 | INPUTS 表键位触发同一 Intent | **仅** Mac |
| 8 | Dynamic Type / VoiceOver 抽样 | 主 CTA 可聚焦；动态字体不截断关键标题（宜做） | 全（裁剪须在 INPUTS 写明） |

## CI

| 门禁 | 何时 |
|------|------|
| `xcodebuild test`（Swift Testing + 必要 XCTest） | 每 PR `check` |
| 矩阵 1–5 | 发版必绿 |
| 6–7 | Mac 目标发版必绿；无 Mac → 报告 `N/A` |
| 8 | 宜做；裁剪则 acceptance 一行理由 |
| `check-inputs` | 每 PR |
| `check-acceptance` | 每 PR：核对 `11` **A+B+D**（**不含** C） |
