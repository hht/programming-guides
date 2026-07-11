# 00 — 原则与不变量

## 品类

用 **Swift / SwiftUI** 交付 **iPhone / iPad / Mac** 原生体验；状态驱动 UI；数据流可测。

## 核心正确性路径（全文唯一）

**View-State Lifecycle**：`intent → 更新 Model/Store → 派生 UI 状态 → 渲染`；副作用可取消；重活离主线程，UI 状态更新回 MainActor。规格见 [05](./05-view-state-lifecycle.md)。

## 硬不变量

1. **SwiftUI 默认主路径**：屏幕与导航用 SwiftUI；**禁止**以 UIKit/`UIViewController` 作为默认导航与列表主路径。UIKit 仅允许：系统桥接、现成 UIKit-only 控件包装、遗留互操作（须在 PR 注明桥接点）。 
2. **状态驱动**：View **不**持有业务真相；真相在 Model / Store（`@Observable` 或等价）；View 只读派生态并发送 intent。 
3. **Observation 先进默认**：新代码用 **Observation / `@Observable`**；**禁止**把 Combine 当默认全局状态总线（可局部用于系统 API 适配）。 
4. **Structured Concurrency**：异步用 `async`/`await` + `Task`；副作用绑定生命周期且 **可取消**（见 `07`）。 
5. **MainActor 边界**：UI 状态 mutation **仅**在 `@MainActor`（或等价主线程隔离）；重 CPU/IO 在非主 actor；回写 UI 态显式回主 actor。 
6. **NavigationStack**：导航默认 `NavigationStack` + 类型化 path；禁隐式多套并行「手写 push」无 path SSOT。 
7. **诚实 UI 态**：loading / empty / error / success（及 submitting）按 [templates/view-state-matrix.md](./templates/view-state-matrix.md) 交付；**禁止**假成功空数据冒充已加载。 
8. **本册 = Apple 原生客户端 SSOT**：鉴权语义引用 [docs/auth](../auth/README.md)；视觉决策可引用 [docs/ui-ux](../ui-ux/README.md)；不平行第二套 View-State 语义。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 目标平台 / 最低版本 / Bundle | `INPUTS.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |
| View-State 步骤与失败类 | `05-view-state-lifecycle.md` |
| 可取消副作用 / actor 边界 | `07-concurrency-and-side-effects.md` |
| Mac 窗口/菜单/键盘 | `08-mac-desktop.md` |
| 屏幕态矩阵 | `templates/view-state-matrix.md` + INPUTS §3 |

## 禁止

- 指南仓堆可运行业务 App 源码 / 完整 feature 模块 
- TCA / RIBs / VIPER 规定为唯一默认架构（可学边界，默认仍 SwiftUI + Observation） 
- Catalyst 当「Mac 原生」默认交付 
- View 内直接发起不可取消的网络/长任务且无视 `.task` / `Task` 取消 
- 在非 MainActor 直接改 `@Observable` UI 发布字段（无隔离） 
