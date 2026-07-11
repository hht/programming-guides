# 06 — Navigation Compose

## 不变量

- **主导航** = Navigation Compose（`NavHost` + 图）；禁平行手写 Activity 栈当主路径。 
- Route / 参数名来自 Pass1 词表；深链 URI 与 route 映射写在 INPUTS §6。 
- 导航是 **副作用**：由 Event 触发 ViewModel/UI 协调调用 `NavController`，或 type-safe navigate；**禁止**在 Repository 里导航。 
- 返回栈与「单顶」行为产品写明；默认：同 route 不重复 push（`launchSingleTop` 等按图配置）。

## 步骤规格（实现自写）

1. **定义图** 
 - 起始目的地 = INPUTS。 
 - 每个目的地 ↔ 一个 Screen；参数用 type-safe（推荐 Navigation 类型安全 DSL）或显式 `navArgument`。 

2. **传参** 
 - 路径参数 / 可选 query；复杂对象 **禁止** 默认真塞 Bundle 大对象——传 **id**，目标屏经 Lifecycle 拉数。 

3. **与 UiState 协作** 
 - 进入目的地 → `Event.Enter(args)` 或 ViewModel `SavedStateHandle` 读参 → 走 `05`。 
 - 登录门闸：未认证 → 导航登录（语义对齐 [docs/auth](../auth/README.md) 若启用）。 

4. **一次性导航事件** 
 - 用 Channel/`SharedFlow` 消费导航命令，避免重组重复 navigate。 

5. **深层链接（若适用）** 
 - Manifest + NavDeepLink；非法 URI → 安全落点（首页或 error），禁崩溃。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺必选 nav 参数 | 不进入业务 success；error 或回退 |
| 未登录进受保护目的地 | 重定向登录；回来后恢复原意图（若 INPUTS 要求） |
| 重复点击导航 | singleTop / debounce；不堆多份同屏 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 起始目的地 | 冷启动落到 INPUTS 起始 route |
| 带 id 打开详情 | ViewModel 收到 id；触发加载 |
| 返回 | 回上一目的地；状态符合 `07` |
| 深链合法 | 落到目标；非法不崩 |
