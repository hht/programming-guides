# Apple Platforms — iOS + Mac 原生指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**从零落地世界级 **SwiftUI 原生**（iPhone / iPad / Mac）体验：状态驱动 UI、可测数据流、可取消副作用。  
> **默认栈**：**Swift 6** + **SwiftUI**（禁 UIKit 作默认主路径；UIKit 仅桥接）+ **Observation / `@Observable`**（先进，优于 Combine 默认）+ **Structured Concurrency** + **NavigationStack** + **Swift Testing**（先进；可与 XCTest 并存）+ Mac 同代码基（`#available` / 目标条件）。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用 **Swift / SwiftUI** 交付 **iPhone / iPad / Mac** 原生体验；UI 由可观测状态驱动；数据流可单测；Mac 面有窗口 / 菜单 / 键盘专章。

## 核心正确性路径

**View-State Lifecycle**（[05](./05-view-state-lifecycle.md)）：`intent → 更新 Model/Store → 派生 UI 状态 → 渲染`；副作用 **可取消**；重活离主线程，UI 状态回 **MainActor**。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`；**UI 状态矩阵必做**）  
3. 落地 [03](./03-targets-and-app-shell.md) / [04](./04-observation-and-stores.md) / [05](./05-view-state-lifecycle.md)（核心）  
4. 落地 [06](./06-navigation-and-presentation.md) / [07](./07-concurrency-and-side-effects.md)；若目标含 Mac → [08](./08-mac-desktop.md)（无 Mac 目标则 `08` 在报告写 `N/A — Mac not targeted`，但 INPUTS 须显式勾选）  
5. [commands.md](./commands.md) `check` 绿  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；目标平台 / 设计态 / API |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 + UI 状态矩阵 |
| [03](./03-targets-and-app-shell.md) | Target / App 壳 / 多平台 |
| [04](./04-observation-and-stores.md) | Observation / Store 边界 |
| [05](./05-view-state-lifecycle.md) | **View-State Lifecycle** |
| [06](./06-navigation-and-presentation.md) | NavigationStack / 呈现 |
| [07](./07-concurrency-and-side-effects.md) | 并发 / 可取消副作用 / MainActor |
| [08](./08-mac-desktop.md) | **Mac 桌面专章**（窗口/菜单/键盘） |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | 矩阵 / xcconfig 例 |

## 心智模型

```text
INPUTS → Swift 6 + SwiftUI 栈 → Target/壳 → Store+Observation
  → View-State Lifecycle（可取消副作用）→ Navigation → Mac 面（若目标）→ check → 验收
```
