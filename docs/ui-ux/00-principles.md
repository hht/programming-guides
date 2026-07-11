# 00 — 原则与不变量

## 决策优先级

正确性（任务可完成）> 可验证性 > 简洁性 > 复用 > 速度。

## 硬不变量

1. **一屏一主任务**：首屏主 CTA 唯一；次要操作用弱样式。 
2. **状态必设计**：可交互组件按 [05](./05-components-and-states.md) **八列**矩阵交付（不适用填 `N/A`）；至少须覆盖适用的 default / disabled / loading / empty / error。 
3. **系统控件优先**：原生平台优先用系统导航与控件；Web 优先用已有 DS；禁无理由自造第三套。 
4. **a11y 非可选**：对比度、焦点、触控目标、语义标签按 `07`。 
5. **交付可实现**：无状态矩阵与命名规范的「好看图」不算完成。 
6. **deletion-first**：无 INPUTS 的屏/组件不做。

## SSOT

| 真相 | Owner |
|------|--------|
| 用户任务与成功标准 | INPUTS §1 |
| 平台行为 | INPUTS §2 + `08` + HIG/M3 引用 |
| Token | **写 SSOT = `design/tokens.md`**（语义名）；Figma Variables **必须同名镜像**。冲突时以 `tokens.md` 为准改 Variables。工程 Apply 见 [design-tokens](../design-tokens/README.md) |
| 组件状态 | `design/matrices/<screen-id>.md`（列见 templates） |
| 文案 | INPUTS §4（及错误文案表）；H5 不另造同义 key |
| join key | `02` 的 `screen-id` |

## 超越

1. `对照：B 中更弱/未见「每交互组件强制状态矩阵交付」硬门闸 → 本指南要求` 
2. `对照：B 中更弱/未见「WCAG 2.2 AA 作为设计完成门闸」硬门闸 → 本指南要求`
