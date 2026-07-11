# 04 — Observation 与 Store

## 不变量

- 每个 **Capability** 有明确 Store（`@Observable`），持有 Model 与加载/提交相位。 
- View 通过读取 Store 派生态渲染；写操作只经 **Intent**。 
- **禁止** Combine `ObservableObject` 作为新代码默认（遗留迁移除外，须列债）。 
- 远程列表/详情的**权威数据**在 Store（或 Store 背后的 repository）；禁平行第二份「UI 缓存真相」无失效策略。

## 步骤规格（实现自写）

1. **定义 Model**：领域类型用 Pass1 词根；与 API 字段映射集中在 Networking 边界（映射函数，非 `*Dto` 领域后缀）。 
2. **定义 Store**：`@Observable @MainActor final class <Capability>Store`（或拆分非主 actor 的 worker；UI 字段仍 MainActor）。 
3. **相位字段**：至少 `phase: ViewState`（或等价：`isLoading`/`error`/`items` 组合须能映射到矩阵列）。 
4. **Intent API**：`func send(_ intent: <Capability>Intent)` 或具名方法 `load()` / `submit(...)`——与词表一致；内部启动可取消 Task（`07`）。 
5. **派生**：UI 用计算属性（例：`var isSubmitDisabled: Bool`）而非 View 内复制规则。 
6. **作用域**：Screen 级 Store 用 `@State` / 环境注入；App 级仅放真正跨屏会话（例：当前 Account），禁上帝 Store。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 加载失败 | `phase = error`；保留上次成功数据（若有）除非 INPUTS 要求清空 |
| 空列表 | `phase = empty`；**不是** error |
| 取消 | `phase` 回退到取消前稳定态或 `cancelled`；**不**弹 error Alert |
| 未登录 | `UNAUTHORIZED` → 导航登录（对接 auth 册） |

## 与标杆边界

| 标杆 | 可学 | 不学进默认 |
|------|------|------------|
| IceCubesApp | SwiftUI 屏幕拆分、时间线状态 | 照搬全部第三方 |
| EhPanda (TCA) | 状态机边界、副作用可控 | **强制** Composable Architecture 依赖 |
| UTM | 多平台 target、Mac 设置面 | 虚拟化领域实现 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| `load` 成功空数组 | `empty`；非 error |
| `load` 抛 NETWORK | `error`；Retry intent 可再 load |
| `send` 在已 submitting | 忽略或合并；无双提交副作用（与 `05` 一致） |
| Store 纯函数派生 | 给定 Model → `isSubmitDisabled` 断言 |
