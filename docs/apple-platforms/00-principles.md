# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [swift Language Gate](../meta/language-gates/swift.md)。本文件含 **Apple 客户端框架 MUST**（SwiftUI Lifecycle）。

## 品类

用 **Swift / SwiftUI** 交付 **iPhone / iPad / Mac** 原生体验；状态驱动 UI；数据流可测。

## 核心正确性路径（全文唯一）

**View-State Lifecycle**：`intent → 更新 Model/Store → 派生 UI 状态 → 渲染`；副作用可取消；重活离主线程，UI 状态更新回 MainActor。规格见 [05](./05-view-state-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 屏幕与导航用 SwiftUI 作为默认主路径 | 目录/导航抽检 |
| F02 | MUST NOT | 以 UIKit/`UIViewController` 作为默认导航与列表主路径（桥接须 PR 注明） | 同上 |
| F03 | MUST | View **不**持有业务真相；真相在 Model/Store（`@Observable` 或等价） | `05` 探针 |
| F04 | MUST | 新代码用 Observation / `@Observable` | 代码抽检 |
| F05 | MUST NOT | 把 Combine 当默认全局状态总线 | 同上 |
| F06 | MUST | 异步用 `async`/`await` + `Task`；副作用可取消 | `07` |
| F07 | MUST | UI 状态 mutation 仅在 `@MainActor`（或等价） | `07` |
| F08 | MUST | 导航默认 `NavigationStack` + 类型化 path | `06` |
| F09 | MUST | loading/empty/error/success（及 submitting）按矩阵交付 | templates + e2e |
| F10 | MUST NOT | 假成功空数据冒充已加载 | 同上 |
| F11 | MUST | 本册为 Apple 原生客户端 SSOT；鉴权/视觉引用 auth、ui-ux 册 | 边界抽检 |

## SSOT 表

| 真相 | Owner |
|------|--------|
| 目标平台 / 最低版本 / Bundle | `INPUTS.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |
| View-State 步骤与失败类 | `05-view-state-lifecycle.md` |
| 可取消副作用 / actor 边界 | `07-concurrency-and-side-effects.md` |
| Mac 窗口/菜单/键盘 | `08-mac-desktop.md` |
| 屏幕态矩阵 | `templates/view-state-matrix.md` + INPUTS §3 |

## 禁止（摘要）

- 指南仓堆可运行业务 App 源码  
- TCA / RIBs / VIPER 规定为唯一默认架构  
- Catalyst 当「Mac 原生」默认交付  
