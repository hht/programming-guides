# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| SwiftUI | https://developer.apple.com/documentation/swiftui |
| Human Interface Guidelines | https://developer.apple.com/design/human-interface-guidelines/ |
| Swift Concurrency | https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/ |
| Observation（框架） | https://developer.apple.com/documentation/observation |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [Dimillian/IceCubesApp](https://github.com/Dimillian/IceCubesApp) | P1 | SwiftUI 客户端结构、时间线/设置态、多平台观感 | AGPL 约束下勿粘贴代码；勿整仓当目录圣经 | SwiftUI 社交客户端（iOS 为主） |
| B | [EhPanda-Team/EhPanda](https://github.com/EhPanda-Team/EhPanda) | P1 | 复杂状态边界、副作用可控（TCA 实践） | **不**强制默认栈改用 TCA | SwiftUI 内容浏览 + 强状态机 |
| C | [utmapp/UTM](https://github.com/utmapp/UTM) | P1 | iOS+Mac 同产品、Mac 窗口/设置面 | 虚拟化实现细节 | 多平台原生工具（含 Mac） |

可选 Mac 参考（非第三标杆计数）：[Whisky-App/Whisky](https://github.com/Whisky-App/Whisky) — SwiftUI Mac 桌面交互。

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 状态驱动列表/主屏（加载/空/错） | ✓ | ✓ | ✓ | 必做 |
| 用户写操作或可变配置提交 | ✓ | ✓ | ✓ | 必做 |
| 导航栈 / 层级进出 | ✓ | ✓ | ✓ | 必做 |
| 设置/偏好入口 | ✓ | ✓ | ✓ | 必做 |
| iPhone 适配 | ✓ | ✓ | ✓ | **条件**：INPUTS 含 iPhone |
| iPad 适配 | ✓ | —/弱 | ✓ | **条件**：INPUTS 含 iPad |
| Mac 桌面（窗/菜单级操作） | —/弱 | — | ✓ | **条件**：INPUTS 含 Mac；证据 ≥2 时用 UTM + Whisky/HIG |

> 「可取消异步 / MainActor 回写」→ **仅超越**（差距表 + `11`§C a1/a2），**不进本表**。  
> Observation / Store / Swift Testing → **工程面 §1.2**（`11`§A）。

## 差距表

| 缺口 | 来自标杆 | 类型 | 落入文件 | 必做/可选/参考 |
|------|----------|------|----------|----------------|
| SwiftUI 主路径 + 多 target 壳 | A,C | 工程 | `03` | 必做 |
| Observation Store + Intent | A,B（映射） | 工程 | `04` | 必做 |
| View-State 编号步骤 + 失败类 | A,B,C | 工程 | `05` | 必做 |
| NavigationStack 类型化路由 | A,B | 功能/工程 | `06` | 必做 |
| 可取消副作用 + CANCELLED | 超越 / P0 并发 | 工程/超越 | `07` | 必做/超越 |
| MainActor 外重活 + UI 回写 | 超越 / P0 | 工程/超越 | `07` | 必做/超越 |
| Mac 窗口/菜单/键盘 | C (+ Whisky) | 功能 | `08` | 条件必做 |
| UI 状态矩阵 | A,B,C + HIG | 工程 | `02` + templates | 必做 |
| Swift Testing 门禁 | P0/生态 | 工程 | `09` / `commands` | 必做 |
| TCA 作默认架构 | B | — | `01` 冲突表 | **不**默认 |
| Combine 全局总线 | 遗留常见 | — | `01` | **禁止**默认 |
| Catalyst 当 Mac | — | — | `00`/`08` | **禁止**默认 |
| APM/Sentry | — | 参考 | — | 参考；**不进必勾** |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| EhPanda/TCA 流行于复杂 SwiftUI vs Observation 先进默认 | **默认 SwiftUI + Observation**；TCA 仅学边界（先进性 + P0 Observation） |
| Combine/`ObservableObject` 存量多 | **新代码 Observation**；遗留可迁移债 |
| UIKit 导航习惯 | **SwiftUI NavigationStack** 默认；UIKit 仅桥接 |
| Catalyst 快速「上 Mac」 | **原生 macOS target**；Catalyst 非默认 |
| IceCubes 第三方栈丰富 | 学结构与态；**不**把其依赖并集当必做 |
| Swift Testing vs 仅 XCTest | **Swift Testing 先进默认**；XCTest 可并存 |
