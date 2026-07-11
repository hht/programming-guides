# 01 — 默认工具与基线（钉死）

## 「栈」表

| 层 | 选择 | 备注 |
|----|------|------|
| 设计工具 | **Figma** | Auto Layout 必开 |
| 规范 | **HIG**（Apple）/ **M3**（Android）/ **WCAG 2.2 AA**（全平台） | Web：密度跟 M3、清晰度跟 HIG；见 `08` |
| Token | 颜色 / 字号 / 间距 / 圆角 / 阴影 | Figma Variables 或 `design/tokens.md`；工程流水线见 [design-tokens](../design-tokens/README.md) |
| 组件源 | 已有 DS > shadcn 思维变体 > 平台系统组件 | 禁平行第二套 |
| Agent 出图 | Figma MCP / Plugin API（若可用） | 产出须过 `commands check` |

**禁止开口**：「随便用 Sketch/XD」；「先画视觉再想任务」。

## 默认数值（可改但须单处）

| 项 | Web | iOS | Android | macOS |
|----|-----|-----|---------|-------|
| 最小点击/触控 | 44×44 CSS px | 44×44 pt | 48×48 dp | ≥24×24 pt（重要 ≥28） |
| 正文对比 | ≥4.5:1 | 同 WCAG | 同 | 同 |
| 大字/粗体对比 | ≥3:1 | 同 | 同 | 同 |
| 基准间距 | 4 的倍数 | 8pt | 8dp | 8pt |
| 内容最大宽 | 720 阅读 / 1200 应用壳 | — | — | 内容区随窗口；设计宽 1280 |

## 脚手架

树与命名见 [02](./02-directory-and-naming.md)（SSOT）。本文件不重复第二套树。
