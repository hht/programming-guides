# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（写明词根；路径可微调，**词根不可改**）

```text
<repo>/
 UBIQUITOUS_LANGUAGE.md
 package.json # scripts 对齐 commands.md
 app.json | app.config.ts # Expo 配置；禁密钥
 app/ # Expo Router 文件路由（入口）
 _layout.tsx # 根布局
 index.tsx # 起始 route（或 (tabs)/…）
 <domain>/ # 段名 = Pass1 词根
 index.tsx # 列表/入口 Screen
 [id].tsx # 详情（参数名词表）
 src/
 features/<domain>/
 <Domain>UiState.ts # 不可变类型
 <Domain>Event.ts # 用户/系统事件
 use<Domain>Screen.ts # 持有 UiState、消化 Event、focus/blur
 model/ # 纯 reduce / 门闸（可测）
 ui/ # 展示组件；只读 props = UiState 切片
 core/
 designsystem/ # 主题、通用组件（非业务名）
 data/ # Repository、HTTP、SecureStore
 lib/ # 非业务基础设施（HttpClient 等）
 # 测试：*.test.ts 旁挂；禁 helpers/ 大口袋当领域主名
 # 禁：manager/、dto/、handleClick 作领域主名
```

## 依赖方向

```text
app/* (route) → features/<domain>/use*Screen → model（纯）→ data/Repository
 → features/.../ui → core/designsystem
 use*Screen → Repository（接口）
 data → fetch / SecureStore / 原生模块（经兼容表）
```

禁止：`ui` / route 文件 → 直接 HTTP；`data` → `ui`；Screen 持有可变业务真相当第二 SSOT。

## UI 状态落点（必做）

| 态 | 含义 | 落点 |
|----|------|------|
| `loading` | 首载或刷新中 | `UiState` 字段或判别联合 |
| `empty` | 成功但无条目 | 同上；**≠** not-found |
| `error` | 可展示失败 | 同上 + 错误码/文案 key |
| `success` | 有可展示内容 | 同上 |
| `not-found` | 详情目标不存在 | 详情屏专用；列表 N/A |

矩阵模板：[templates/ui-state-matrix.md](./templates/ui-state-matrix.md)（INPUTS §4 必填）。

## Pass 1 — 业务语义（必做）

目标仓建立 `UBIQUITOUS_LANGUAGE.md`，至少收录：

| Term | 含义 | 代码符号 | 禁同义词 |
|------|------|----------|----------|
| UiState | 屏幕不可变真相快照 | `XxxUiState` | `XxxViewData`、`XxxDto` |
| Event | 进入 Screen model 的意图 | `XxxEvent` | `XxxAction` 若未收词则禁并行 |
| Screen | route 对应 UI | `XxxScreen` | `XxxPage` 分叉 |
| ScreenModel | 持有 UiState、消化 Event、管 focus | `useXxxScreen` | `XxxManager`、`XxxController` |
| Repository | 数据边界 | `XxxRepository` | `XxxDataManager`、`XxxService`（后缀） |
| Navigate | 导航意图 | `router.push` / 词表 path | `handleNav` |
| Loading / Empty / Error / Success | 四态 | 字段或联合 | `busy`/`fail` 同分叉 |
| Focus / Blur | 路由焦点 | `useFocusEffect` 等 | 随意自造生命周期名分叉 |

**禁**：`*Dto`、`*Manager`、`*Helper`、`handle*`、`process*`、`do*` 进领域主名（词表未收录则禁）。

| 概念 | 正例 | 反例 |
|------|------|------|
| Feature | `features/orders/` | `features/data-layer/` |
| 状态 | `OrderListUiState` | `OrderListDto`、`OrderManagerState` |
| 事件 | `OrderListEvent.Refresh` | `handleRefresh`、`processClick` |
| 纯规则 | `canSubmitOrder` | `validatePayload` |
| Route | `app/orders/[id].tsx` | `app/screens/OrderDetailManager.tsx` |

## Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 目录 | kebab 或词根小写；`app/` 段 = Pass1 |
| 类型 | PascalCase：`OrderListUiState` |
| 函数 / hook | camelCase；hook 前缀 `use` |
| 文件 | 与主符号同名或 route 约定 |
| 错误码 | `SCREAMING_SNAKE` 与 INPUTS / 词表一致 |
| env 键 | `SCREAMING_SNAKE`（见 templates） |
