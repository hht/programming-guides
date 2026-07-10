# 08 — Figma 交付与平台适配

## Figma 不变量

- Auto Layout 必开  
- 命名：`<platform>/<task-id>/<screen-id>/<state>`（join key 见 `02`）  
- 组件：`UI/<Name>/<Variant>`；Variant 名与矩阵列名一致（default/hover/…）  

## Figma 步骤

1. 每屏顶层 Frame；宽：Web 1440+375；iOS 390；Android 360；macOS 1280。  
2. 间距/padding 绑 token。  
3. 状态用 Variant 或并排 Frame（名=状态列）。  
4. 注释：主 CTA、字段、动态数据、破坏性确认。  
5. Agent MCP 出图后必须跑 `commands check`；未过不得完成。  
6. 写 `figma-notes.md`（URL + 列表 + `a11y: PASS`）。  

## 平台适配

| 主平台 | 必读 | 导航默认 | 字体默认 |
|--------|------|----------|----------|
| ios | HIG | INPUTS §2b：默认 tab+stack | SF Pro |
| android | M3 | INPUTS §2b：必选 `navigation-bar` / `navigation-rail` / `navigation-drawer` | 系统 |
| macos | HIG | INPUTS §2b：默认 sidebar+toolbar | SF Pro |
| web | WCAG + 本指南 | INPUTS §2b：**必选**顶栏或侧栏 | INPUTS 字体或系统 |

共享：任务、IA、token、文案。分叉：导航容器与系统弹窗。

## macOS 基线（补 `01`）

| 项 | 值 |
|----|-----|
| 点击目标 | ≥24×24 pt（指针）；重要控件建议 ≥28 |
| 网格 | 8pt |

## 探针

| case | 期望 |
|------|------|
| 命名 | 可反查 screen-id |
| iOS 稿 | 无未说明的 Material 底栏照搬 |
