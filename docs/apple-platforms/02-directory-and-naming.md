# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（写明词根；路径可微调，**词根不可改**）

```text
<repo>/
 UBIQUITOUS_LANGUAGE.md
 App/ # @main App 入口（薄）
 Features/
 <Capability>/ # 业务能力名 = Pass1 词根（例：Timeline、Vault、Machine）
 <Capability>Screen.swift # SwiftUI View
 <Capability>Store.swift # @Observable 状态 + intent
 <Capability>Model.swift # 领域模型（非 *Dto）
 Navigation/ # 路由类型、根栈、深链解析
 Shared/
 Networking/ # API client（非业务名则保持 Shared）
 DesignSystem/ # 颜色/字体/控件（对位 ui-ux）
 Mac/ # 仅 macOS：菜单、窗口命令、快捷键（#if os(macOS)）
 Resources/ # Assets、本地化
 Tests/
 <Capability>StoreTests.swift
 # 禁：Managers/、*Service 作 Features 主名、DTO/、Handlers/
```

多平台：共享源进同一 target membership 或 SPM 共享库；平台专属文件用 `#if os(...)` 或独立 `Mac/` 目录。

## 依赖方向

```text
App → Features → Shared
 ↓
 Navigation（路由类型可被 Features 引用；Features 不反向依赖具体 Screen 图）
View → 发送 Intent → Store → 更新 Model → 派生 ViewState → View 渲染
副作用（网络/磁盘）← Store 启动 Task；取消随生命周期
```

禁止：View 直接改持久化或绕过 Store 发网；Store 依赖具体 SwiftUI View 类型。

## UI 状态矩阵（必做 · 禁止整表 N/A）

每个主 Screen 须在 [templates/view-state-matrix.md](./templates/view-state-matrix.md) 填行。默认列：

| 状态 | 含义 | 落点 |
|------|------|------|
| `default` / `idle` | 有数据可交互，或首屏未触发加载 | Screen 主内容 |
| `loading` | 首次或刷新进行中 | Progress / redacted / overlay（INPUTS 选定一种） |
| `empty` | 成功但无条目 | Empty 文案 + 主 CTA |
| `error` | 加载/提交失败 | 错误文案 + Retry intent |
| `submitting` | 写操作进行中 | 主按钮 disabled；防双提交 |
| `cancelled` | 用户离开或显式取消 | 不把取消当 `error` 弹致命告警 |

产品可改名，但须一词一义写入词表；**不得**因「纯工具 App」把矩阵标 N/A。

## Pass 1 — 业务语义（必做）

目标仓建立 `UBIQUITOUS_LANGUAGE.md`，至少收录：

| Term | 含义 | 代码符号 | 禁同义词 |
|------|------|----------|----------|
| Intent | 用户或系统触发的意图 | `Intent` / `send(_:)` | `handleAction`、`processEvent`（未收词则禁） |
| Store | 能力级可观测状态容器 | `<Capability>Store` | `*Manager`、`*ViewModel` 作新主后缀（遗留迁移可暂留并列入债） |
| Model | 领域实体/值 | `<Entity>` | `*Dto`、`*Entity` 后缀 |
| ViewState | 供 UI 消费的派生态 | `ViewState` / `phase` | 与 Model 混名 |
| Screen | 一屏 SwiftUI 界面 | `<Capability>Screen` | `*ViewController` 作默认主名 |
| Route | 导航目的地 | `Route` | `NavDest` 分叉（择一） |
| Load | 读侧加载 | `load` / `Load` | `fetchData` 技术名当业务主名 |
| Submit | 写侧提交 | `submit` / `Submit` | `doSave`、`handleSubmit` |
| CANCELLED | 任务被取消 | `CANCELLED` | 与 `NETWORK` 混用 |
| UNAUTHORIZED | 未授权 | `UNAUTHORIZED` | — |

**禁**：`*Dto`、`*Manager`、`*Service`（作 Features 类型后缀）、`handle*`、`process*`、`do*` 进领域主名。

| 概念 | 正例 | 反例 |
|------|------|------|
| 能力目录 | `Features/Timeline/` | `Features/TimelineManager/` |
| 状态容器 | `TimelineStore` | `TimelineViewModelManager` |
| 意图 | `TimelineIntent.refresh` | `handleRefresh()` 无词表 |
| 错误 | `CANCELLED`、`NETWORK` | `ERR_1`、`DtoFail` |

## Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 类型 / Screen / Store | PascalCase |
| 函数 / intent case 关联值 | camelCase |
| 文件 | 与主类型同名 PascalCase（Swift 惯例） |
| 错误码 | `SCREAMING_SNAKE` 与词表一致 |
| Bundle / scheme | 产品约定；staging 可用 `.staging` 后缀 |
| 资源名 | 资产用语义名；禁 `img1` |
