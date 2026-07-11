# 08 — 对位 ui-ux 与多平台

## 不变量

- **ui-ux** = 设计决策与 Figma 交付 SSOT（Design Decision Lifecycle）。  
- **design-tokens** = Token Apply Lifecycle（工程）。  
- 两册对位、**不互相改名吞并**；启用对接时 **语义 token 路径同名**。  
- 多平台共享 semantic 名；分叉只在 transform 产物与平台控件，不在第二套色名。

## 步骤规格（实现自写）

### 1. 与 ui-ux 对齐清单

| ui-ux 产物 | 本册动作 |
|------------|----------|
| INPUTS 品牌 / 深色 / 密度 | 填本册 INPUTS §6–9 |
| `design/tokens.md`（写 SSOT）+ Variables 同名镜像 | 路径 ∈ 本册 semantic；值变更走 Apply Lifecycle |
| handoff 中的 token 列 | 实现 agent 引用语义名，不抄 hex 进组件 |
| 状态矩阵 | 色态（danger/disabled）用同一语义名 |

### 2. 漂移检查（启用 ui-ux 时必做）

1. 导出或列出 `design/tokens.md`（及同名 Variables）路径集合 `D`。  
2. 列出工程 `tokens/semantic/**` 路径集合 `E`。  
3. 规则（默认）：`E ⊆ D` 或 `E = D`（INPUTS 钉）；设计多出的可选 token 须标 `design-only` 或尽快进工程。  
4. `tokens:check-drift` 含此项则失败即红。

### 3. 多平台

| 平台 | 共享 | 分叉 |
|------|------|------|
| Web | semantic 名、对比度目标 | CSS 变量 / Tailwind 映射 |
| iOS | 同名语义 | HIG 系统字体可替代 font family token；色仍走语义 |
| Android | 同名语义 | M3 角色可映射到本册 semantic，**禁止**再引入 Material 角色名作第二消费 SSOT（映射表单处） |
| macOS | 同名语义 | 同 iOS 密度差异见 ui-ux `01`/`08` |

### 4. 禁止的对位错误

- 为「Figma 里叫 Blue/500」而在 UI 正式消费 `blue-500`（应：primitive 可有 palette，UI 用 `color.primary`）。  
- Web 用 `foreground`、iOS 用 `label` 且无映射表——须单处映射，对外文档仍用本册词表。  
- 把本册写成 Figma 操作百科（归 ui-ux `08`）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| §7=N/A | 跳过 Figma 同名；仍跑源↔产物 drift |
| 设计改名未改工程 | drift 红；先改源再改 Figma 或反之（跟同步方向） |
| 平台 SDK 强制色名 | 适配层隔离；业务 UI 仍本册名 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 同名 | `color.primary` 在设计列表与 DTCG 皆存在 |
| Android 映射 | 业务代码不出现未登记的第二套 Material 色角色名 |
| handoff 抽检 | 实现引用语义名可解析到变量 |
