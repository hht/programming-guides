# 05 — UiState Lifecycle（核心）

> **全文唯一核心正确性路径。** 
> event → ViewModel/reducer → UiState → Compose 重组。

## 不变量

- 每个用户可感知状态变化 **只** 经本生命周期；禁止 Composable 旁路改业务真相。 
- UiState **单一不可变真相**（超越 a1，见 `11`）。 
- 配置变更后：Lifecycle 不重置业务真相（ViewModel 存活 / SavedState，见 `07`；超越 a2）。 
- 失败 **可展示、可测**：映射 INPUTS 错误码；禁止静默吞掉后假装 success。

## 步骤规格（编号固定）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **Event 进入** | 来源：用户点击、下拉刷新、导航参数到位、生命周期 `Started` 触发的初次加载等。一律表示为 `Event`（或汇入 `onEvent`）。**禁止** UI 直接写 Repository。 |
| 2 | **ViewModel 接收** | `onEvent(event)`（或等价）为唯一入口；校验 Event 合法性（非法 → 忽略或 error UiState，策略须写明）。 |
| 3 | **Reduce / 副作用决策** | **纯 reduce**：`(UiState, Event) → UiState` 能表达的变更在此完成（可单测）。需 IO：启动 `viewModelScope` 协程；先发 `loading`（若矩阵需要）再调 Repository。 |
| 4 | **写出新 UiState** | `MutableStateFlow` 更新为**新不可变快照**；禁止原地 mutate 集合。并发：代次/取消 Job，旧响不应覆盖新状态。 |
| 5 | **Compose 收集** | Screen `collectAsStateWithLifecycle`（默认；不低于 `STARTED`）。重组仅依赖读到的 UiState（及明确的一次性 effect）。 |
| 6 | **渲染矩阵态** | 按 `04` 矩阵分支渲染；交互再回到步骤 1。 |

## 失败分类表

| 类 | 条件 | UiState / 导航 |
|----|------|----------------|
| `NETWORK` | 超时/无连接 | `error`；可 Retry |
| `UNAUTHORIZED` | 401/未登录 | error 或导航登录（auth）；禁假 success |
| `NOT_FOUND` | 详情缺失 | `not-found` |
| `VALIDATION` | 输入不合法 | 字段级错误进 UiState；不发写请求或请求被拒 |
| `UNKNOWN` | 未映射 | `error` 通用文案；可打日志（运维第三方不进必勾） |

## 伪代码（非实现）

```text
onEvent(event):
 if (pureChange(event)):
 uiState.value = reduce(uiState.value, event)
 return
 uiState.value = uiState.value.copy(phase = Loading) // 若矩阵需要
 job = viewModelScope.launch {
 result = repository.execute(event)
 uiState.value = mapResultToUiState(uiState.value, result) // 新快照
 }

Screen:
 state = vm.uiState.collectAsStateWithLifecycle()
 Render(state) // loading|empty|error|success|not-found
 onUserAction → vm.onEvent(...)
```

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| Event → reduce 纯路径 | Turbine/断言得到新 UiState；无 IO |
| Event → 成功 IO | loading（若有）→ success/empty |
| Event → NETWORK | error + 码；非 success |
| 配置变更（仪器/Robolectric 或 ViewModel 单测） | 同 ViewModel 实例 UiState 保持（见 `07`/`09`） |
| UI Test：error → Retry | 回到 loading 或再次请求；文案符合矩阵 |
| Composable 内无直接 Repository mock 调用 | 架构边界测试或 code review 清单勾选 |
