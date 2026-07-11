# 07 — 并发与可取消副作用

> 支撑核心路径超越项：可取消副作用；重活离主线程；UI 回 MainActor。

## 不变量

1. **可取消**：每个 in-flight 读/写 Task 可被：`Store.cancelInFlight()`、View `.task` 取消（onDisappear）、新 forceRefresh 取消旧任务（默认策略钉死）。  
2. **协作取消**：长循环 / 多步 await 调用 `Task.checkCancellation()`；捕获 `CancellationError` → 映射 `CANCELLED`（`05`）。  
3. **Actor 边界**：`@MainActor` Store 的 UI 字段只在主 actor 写；`await` 到后台 worker 做解析/图片缩放/大 JSON；回来 `MainActor` 再赋值。  
4. **禁**：`DispatchQueue.main.async` 无取消令牌的「发射后不管」；禁在 `deinit` 才想起取消却仍写 UI。

## 步骤规格（实现自写）

1. **绑定生命周期**：屏幕级加载优先 `View.task(id:)` → 调用 Store；id 变或消失 → 自动取消。  
2. **Store 持有 Task**：`private var loadTask: Task<Void, Never>?`；新 load 前 `loadTask?.cancel()`。  
3. **Worker**：`actor` 或非隔离 `async` 函数执行重活；**不**持有 View 引用。  
4. **回写**：`await MainActor.run { apply(...) }` 或 Store 方法已 MainActor 隔离。  
5. **超时**：若 INPUTS 要超时，用 `withTimeout` / `Task` 竞速；超时 ≠ CANCELLED（可映射 `NETWORK`）。  
6. **并行**：多资源用 `async let` / `TaskGroup`；一组失败策略（fail-fast vs partial）书面钉死。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| `CancellationError` | `CANCELLED`；不 Toast 致命错误 |
| 取消后迟到成功 | **忽略**写回（检查 task id / generation） |
| 主线程做 >16ms 重活 | 禁止；须迁 worker（性能宜做） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 取消后 resume | Model 不被迟到成功覆盖（generation 守卫） |
| checkCancellation 中途 | 抛出 → CANCELLED |
| UI 赋值 | 测试期望在 MainActor（Swift Testing / 隔离断言） |
| `.task` 消失 | in-flight 取消（集成或 Store 单测模拟 cancel） |
