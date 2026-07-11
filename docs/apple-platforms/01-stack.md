# 01 — 默认栈（钉死）

> 选栈：**先进优先**；流行度仅佐证。冲突见 [sources.md](./sources.md)。

## 一句话默认栈

**Swift 6** + **SwiftUI**（禁 UIKit 默认主路径）+ **Observation / `@Observable`** + **Structured Concurrency** + **NavigationStack** + **Swift Testing**（先进；可与 XCTest 并存）+ **Xcode** 多 target（iOS / iPadOS / macOS 同代码基）。

## 分层钉死

| 层 | 默认 | 禁止 / 备注 |
|----|------|-------------|
| 语言 | **Swift 6**（严格并发按项目逐步打开；新模块默认启用） | 禁以 Objective-C 写新主路径 |
| UI | **SwiftUI** | UIKit 仅桥接；禁 UIKit 导航/列表作默认 |
| 观测 | **Observation** / `@Observable` | 禁 Combine 作默认全局总线；`@Published`+`ObservableObject` 仅遗留迁移 |
| 并发 | Structured Concurrency（`async`/`await`、`Task`、`TaskGroup`） | 禁随意 `DispatchQueue.global` 无取消协作；GCD 仅系统回调适配 |
| 导航 | **NavigationStack** + `Hashable`/`NavigationPath` 类型化路由 | 禁无 path SSOT 的散落 `NavigationLink` 深链 |
| 网络 | `URLSession` + 自管 API client（或 INPUTS 钉死的薄客户端） | 禁在 View body 直接 `URLSession` 无 Store |
| 持久化 | 默认按 INPUTS：轻量 `AppStorage`/`File`；结构化 → **SwiftData** 或书面 SQLite | 禁第三套平行「随便 UserDefaults 塞大 JSON」无边界 |
| 测试 | **Swift Testing**（`@Test`）为主；XCTest 可并存（UI/旧用例） | 禁无断言矩阵的「只截图」当唯一验收 |
| 包管理 | **Swift Package Manager**（优先）± Xcode project | CocoaPods 非默认 |
| Mac | 同一 SwiftUI 代码基 + `#if os(macOS)` / `@available` | **禁** Catalyst 当默认 Mac 交付 |
| 架构参考 | 可学 TCA **边界**（标杆 B）；**不**强制引入 TCA | EhPanda/TCA 模式 ≠ 默认栈 |

## 脚手架

```bash
# 在空仓用 Xcode：File → New → Project → Multiplatform → App
# 或命令行（Xcode 已装）：
# 创建 iOS + macOS 共享的 Multiplatform App（以当前 Xcode 向导为准）
xcodebuild -version   # 确认 Xcode；本指南不钉具体 Xcode 大版本号，钉能力：Swift 6 + SwiftUI Observation
```

锁版本：用 Xcode 工程 / `Package.resolved` 锁定依赖；本指南不钉 semver 数字，钉**能力边界**（Swift 6、Observation、NavigationStack、Swift Testing）。

## 环境

见 [templates/xcconfig.example](./templates/xcconfig.example)；staging/prod **成对**（INPUTS §7）。
