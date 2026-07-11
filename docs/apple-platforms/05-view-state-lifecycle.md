# 05 — View-State Lifecycle（核心）

> **全文唯一核心正确性路径。** 
> `intent → 更新 Model/Store → 派生 UI 状态 → 渲染`；副作用可取消；重活离主线程，UI 回 MainActor。

## 不变量

- 每个用户可感知写/读流 **只** 经本生命周期；禁止 View 内「偷偷」改 Model 或发网。 
- UI 相位诚实：见 [02](./02-directory-and-naming.md) 矩阵；**禁止假成功**。 
- 超越：① 副作用 Task **可取消**；② 重活离主线程，UI 状态更新回 **MainActor**（见 `07`、`11`）。

## 步骤规格（编号固定）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **Intent 进入** | 用户手势、`.task`、系统回调 → `Store.send(intent)`（或词表等价具名方法）。View **不**直接调用 repository。 |
| 2 | **门闸** | 若 `submitting`/`loading` 且 intent 非取消/非强制刷新 → **丢弃或排队**（INPUTS 选定一种；默认丢弃防双提交）。取消 intent 始终可入。 |
| 3 | **更新相位** | MainActor：先置 `loading` 或 `submitting`；必要时清 `error`。 |
| 4 | **执行副作用** | 启动 **可取消** `Task`（存 token / 用 `.task` id）：网络、磁盘、重计算在 **非 MainActor**（`07`）。协作检查 `Task.isCancelled` / `try Task.checkCancellation()`。 |
| 5 | **更新 Model** | 成功：写入 Model；失败：映射错误码（INPUTS §9）；取消：走 `CANCELLED`，不覆盖为 `NETWORK`。 |
| 6 | **派生 ViewState** | 由 Model + 相位计算：`empty` / `success` / `error` / `cancelled` 等；单一函数或计算属性，供单测。 |
| 7 | **渲染** | SwiftUI 依 Store 自动刷新；按钮 `disabled` 绑定派生；错误区绑 Retry intent。 |

可选：**乐观更新** — 须完整：快照 → 失败回滚 → 最终与权威数据一致；禁止半套。

## 失败分类表

| 类 | 条件 | UI | 备注 |
|----|------|-----|------|
| `NETWORK` | 传输/超时 | `error` + Retry | — |
| `UNAUTHORIZED` | 401/会话失效 | 登录流 | 清本地会话 |
| `NOT_FOUND` | 404 | 专用空/丢失态 | ≠ empty 列表 |
| `VALIDATION` | 4xx 校验 | 字段或 inline | 不发重复错误 Alert 轰炸 |
| `CANCELLED` | 任务取消 | 静默或轻提示 | **禁**当致命 error |
| `UNKNOWN` | 其它 | `error` 通用文案 | 可打日志（运维第三方非必勾） |

## 伪代码（非实现）

```text
send(intent):
 if intent == cancel → cancelInFlight(); set phase cancelled-or-previous; return
 if phase ∈ {loading, submitting} && intent != forceRefresh → return // 默认防双提交
 phase = loading|submitting
 task = Task {
 try Task.checkCancellation()
 result = await worker.perform(intent) // off MainActor
 try Task.checkCancellation()
 await MainActor.run {
 apply(result) // Model + phase
 phase = derive(Model) // empty|success|error
 }
 }
 track(task) // 可 cancelInFlight
```

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| load 成功非空 | phase success；Model 有数据 |
| load 成功空 | empty；非 error |
| load 失败 | error；Retry 再成功 → success |
| 快速连续 submit | 仅一次副作用（或第二次被丢弃） |
| 取消 in-flight | CANCELLED；无 error Alert；无迟到成功写回（或写回被忽略） |
| 重活线程 | worker 不在 MainActor 跑（可测 actor / expectation）；UI 字段更新在 MainActor |
| NOT_FOUND vs empty | 详情缺失 ≠ 列表 empty 文案 |
