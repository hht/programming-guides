# 03 — UiState 与 Screen model

## 不变量

- 每屏（或 INPUTS 声明的共享边界）**恰好一个**不可变 **UiState** 真相源。 
- UiState = `readonly` 对象 / `Readonly<>` / 不可变结构；**禁止** UiState 内可变数组就地 mutate。 
- Screen model（`useXxxScreen` 或等价）**独占**写 UiState；route 组件只订阅只读状态并 `onEvent`。 
- 禁第二套「全局可变 store 偷偷改同一屏业务真相」而不经 Event。

## 步骤规格（实现自写）

1. **定义 UiState** 
 - 命名：`<Domain><Surface>UiState`（词表）。 
 - 覆盖矩阵列：`loading` / `empty` / `error` / `success`（详情加 `not-found`）。 
 - 派生展示字段在 **reducer/纯函数** 计算后写入快照；禁止 JSX 内复制一套业务规则。 

2. **定义 Event** 
 - 联合类型：`Refresh`、`Retry`、业务意图、导航包装等。 
 - UI 只调用 `onEvent(event)`（或具名方法，但须汇入同一消化路径）。 

3. **Screen model** 
 - 持有 `uiState`（`useState` 存不可变快照，或轻量外部 store）；对外只读。 
 - `onEvent`：调用纯 `reduce` 或启动异步 → **set 新 UiState 副本**。 
 - 注入依赖：构造参数 / 闭包工厂（默认）；禁习惯性全局单例难测。 

4. **初始值** 
 - 冷启动 / 进入 focus：`loading` 或 INPUTS 声明占位。 

5. **副作用** 
 - 一次性 UX（toast、导航）用 **独立队列/消费标志** 或明确 effect 通道；禁止「只改了 Repository 期望 UI 自己猜」。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 仓库抛 `NETWORK` | UiState → `error` + 码；保留上次 success 与否由 INPUTS（默认保留列表、清空危险写表单） |
| `UNAUTHORIZED` | error 或导航登录（对接 auth）；**禁止**假 success |
| `NOT_FOUND` | 详情 → `not-found`；列表勿冒充 empty |
| 并发 Refresh | 以最新请求为准（代次/Abort）；禁止旧响覆盖新 UiState |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 初始 UiState | 符合 INPUTS / 矩阵 loading 或约定占位 |
| Event.Refresh 成功 | success 或 empty |
| Event.Retry 在 error 后 | 进入 loading 再收敛 |
| 旧响应晚到 | 不覆盖更新的 UiState |
| UiState 更新 | 新引用；旧快照字段不被 mutate |
