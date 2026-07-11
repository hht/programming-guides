# 03 — UiState 与 ViewModel

## 不变量

- 每屏（或 INPUTS 声明的共享边界）**恰好一个**不可变 **UiState** 真相源。 
- UiState = `data class`（或等价不可变结构）；字段用不可变集合（`List`/`ImmutableList` 等）；**禁止** UiState 内 `MutableState` / 可变 `ArrayList`。 
- ViewModel **独占**写 UiState；UI 只 `collectAsStateWithLifecycle`（或等价）只读。 
- **禁 LiveData 作默认**暴露 UiState（见 `01`）。

## 步骤规格（实现自写）

1. **定义 UiState** 
 - 命名：`<Domain><Surface>UiState`（词表）。 
 - 覆盖矩阵列：`loading` / `empty` / `error` / `success`（详情加 `not-found`）。 
 - 派生展示字段在 **reducer/纯函数** 计算后写入快照；禁止 Composable 内复制一套业务规则。 

2. **定义 Event** 
 - `sealed interface`/`sealed class`：`Refresh`、`Retry`、业务意图、`Navigate` 包装等。 
 - UI 只调用 `viewModel.onEvent(event)`（或具名方法，但须汇入同一消化路径）。 

3. **ViewModel** 
 - 持有 `MutableStateFlow(initial)` → 对外 `StateFlow<UiState>`。 
 - `onEvent`：调用纯 `reduce` 或启动协程拉数 → **emit 新 UiState 副本**（`copy`）。 
 - 注入依赖：构造函数（默认）或 Hilt（仅 INPUTS）。 

4. **初始值** 
 - 冷启动：`loading` 或 INPUTS 声明的占位；有 SavedState 则按 `07` 恢复后再决定是否刷新。 

5. **副作用** 
 - 一次性 UX（snackbar、导航）用 **独立 Channel / SharedFlow 事件消费** 或 UiState 内可消费字段 + 确认已消费；禁止「只改了 Repository 期望 UI 自己猜」。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 仓库抛 `NETWORK` | UiState → `error` + 码；保留上次 success 内容与否由 INPUTS（默认保留列表、清空危险写表单） |
| `UNAUTHORIZED` | UiState error 或发导航登录（对接 auth）；**禁止**假 success |
| `NOT_FOUND` | 详情 → `not-found`；列表勿冒充 empty |
| 并发 Refresh | 以最新请求为准或合并策略须写明；禁止交错旧响应覆盖新 UiState |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 初始 UiState | 符合 INPUTS / 矩阵 loading 或约定占位 |
| Event.Refresh 成功 | success 或 empty；Turbine 收到对应快照 |
| Event.Retry 在 error 后 | 进入 loading 再收敛 |
| 旧响应晚到 | 不覆盖更新的 UiState（若实现取消/代次） |
| UiState 实例 | `copy` 后旧引用不变（不可变） |
