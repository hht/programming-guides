# 08 — 原生可选（SwiftUI / Compose）

> **可选章。** 仅 Web → 整章 N/A。 
> 原则与 Web **同一**：白名单等价属性、帧预算数字、测量、超预算减配。

## 不变量

- 不引入第二套 fps 语义；共用 `04` 数字表与 `05` Lifecycle。 
- 原生动画 API 可不同；**预算与测量义务不可裁**。 
- **系统减动效**：默认尊重（iOS `UIAccessibility.isReduceMotionEnabled` / Android `Settings.Global.ANIMATOR_DURATION_SCALE` 或等价）；关关键持续动画或时长→0。**仅**当 INPUTS §13 书面「不降级」时矩阵行 5 写 N/A（仍须帧预算测量）；不得以「未接系统 API」跳过行 5——须接入上述 API（或平台等价）或走 §13 写明。

## SwiftUI

### 属性等价

| 宜用 | 慎用/避免作关键默认 |
|------|---------------------|
| `opacity`、`scaleEffect`、`offset`、`rotationEffect` | 持续动画改变依赖布局的显式宽高 |
| `withAnimation` + 上述 | 无预算的无限 `.repeatForever` 装饰进关键路径 |

### 步骤规格

1. 关键动画登记同 schema。 
2. 用 Instruments（`06`）测量。 
3. OVER_BUDGET → `07`（缩短、降复杂度、关）。 
4. 对齐 Apple 能效：避免无可见价值的高刷常驻动画（P0 Energy）。

## Compose

### 属性等价

| 宜用 | 慎用/避免作关键默认 |
|------|---------------------|
| `Modifier.graphicsLayer { alpha / translation / scale / rotation }` | 动画 `width`/`height` 作关键默认 |
| `animate*AsState` / `Animatable` 作用于上述 | 无登记的无限循环进关键 |

### 步骤规格

1. 登记 + 预算同 Web。 
2. Android GPU / Profiler（`06`）测量。 
3. OVER_BUDGET → `07`。 
4. 长列表：学 flash-list **回收与测量**思维；Compose 用懒加载列表等价，避免离屏项重动画。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 仅 Web INPUTS | 本章 N/A |
| 原生关键无预算数字 | BUDGET_UNSPECIFIED |
| 原生用重布局动画且超预算 | OVER_BUDGET → degrade |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| iOS 关键行有 frame_budget_ms + instruments | 形态合法 |
| Android 关键动画走 graphicsLayer | 白名单等价 pass |
| 无限 repeat 无登记 | 阻塞或降非关键 |
