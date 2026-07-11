# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（钉死词根；单/多模块可微调路径，**词根不可改**）

```text
<repo>/
  UBIQUITOUS_LANGUAGE.md
  settings.gradle.kts
  gradle/libs.versions.toml          # Version Catalog（推荐）
  app/
    src/main/AndroidManifest.xml
    src/main/kotlin/<package>/
      MainActivity.kt
      <AppName>App.kt                 # 可选 Application
      navigation/                    # NavHost、NavGraph（route 词根来自 Pass1）
      # 单模块时 features 可放此处
  feature/<domain>/                  # 或多模块 :feature:<domain>
    ui/                              # Screen Composable；只收集 UiState + 发 event
    <Domain>ViewModel.kt
    <Domain>UiState.kt               # 不可变 data class
    <Domain>Event.kt                 # 用户/系统事件（sealed）
    model/                           # 纯函数 / reducer（可测）
  core/
    designsystem/                    # 主题、通用组件（非业务名）
    data/                            # Repository 接口实现、网络、DataStore
    domain/                          # 可选：跨 feature 用例纯逻辑
  # 测试：与源码旁挂 *Test.kt / *Screenshot 等；禁平行无业务语义的 helpers 大口袋
  # 禁：manager/、dto/、handleClick 作领域主名
```

## 依赖方向

```text
app/navigation → feature/<domain>/ui → ViewModel → domain/model（纯）→ data/Repository
                 feature/ui → core/designsystem
                 ViewModel → Repository（接口）
                 data → 网络 / DB / DataStore
```

禁止：`ui` → 直接 HTTP；`data` → `ui`；Composable 持有可变业务真相当第二 SSOT。

## UI 状态落点（必做）

| 态 | 含义 | 落点 |
|----|------|------|
| `loading` | 首载或刷新中 | `UiState` 字段或 sealed 分支；Screen 读状态渲染 |
| `empty` | 成功但无条目 | 同上；**≠** not-found |
| `error` | 可展示失败 | 同上 + 错误码/文案 key |
| `success` | 有可展示内容 | 同上 |
| `not-found` | 详情目标不存在 | 详情屏专用；列表 N/A |

矩阵模板：[templates/ui-state-matrix.md](./templates/ui-state-matrix.md)（INPUTS §3 必填）。

## Pass 1 — 业务语义（必做）

目标仓建立 `UBIQUITOUS_LANGUAGE.md`，至少收录：

| Term | 含义 | 代码符号 | 禁同义词 |
|------|------|----------|----------|
| UiState | 屏幕不可变真相快照 | `XxxUiState` | `XxxViewData`、`XxxDto` |
| Event | 进入 ViewModel 的意图 | `XxxEvent` | `XxxAction` 若未收词则禁并行 |
| Screen | 目的地 UI | `XxxScreen` | `XxxPage` 分叉 |
| ViewModel | 持有 UiState、消化 Event | `XxxViewModel` | `XxxPresenter`、`XxxManager` |
| Repository | 数据边界 | `XxxRepository` | `XxxDataManager`、`XxxService`（后缀） |
| Navigate | 导航意图 | `NavigateTo` / route 名 | `handleNav` |
| Loading / Empty / Error / Success | 四态 | 字段或 sealed | `busy`/`fail` 同分叉 |

**禁**：`*Dto`、`*Manager`、`*Helper`、`handle*`、`process*`、`do*` 进领域主名（词表未收录则禁）。

| 概念 | 正例 | 反例 |
|------|------|------|
| Feature | `feature/orders/` | `feature/data-layer/` |
| 状态 | `OrderListUiState` | `OrderListDto`、`OrderManagerState` |
| 事件 | `OrderListEvent.Refresh` | `handleRefresh`、`processClick` |
| 纯规则 | `canSubmitOrder` | `validatePayload` |

## Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 包 / 目录 | 小写；feature 段 = Pass1 词根 |
| 类型 | PascalCase：`OrderListUiState` |
| 函数 / 属性 | camelCase |
| 文件 | 与主类型同名：`OrderListViewModel.kt` |
| Route | 稳定字符串或 type-safe route；段名 = 词表 |
| 资源 id | snake_case：`ic_order`、`label_order_empty` |
| 错误码 | `SCREAMING_SNAKE` 与 INPUTS / 词表一致 |
