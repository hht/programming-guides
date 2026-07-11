# 03 — 动画属性白名单

## 不变量

- 关键路径**只**动画白名单属性；超出 = `WHITELIST_VIOLATION`，发版阻塞。 
- 依据：合成器友好、避免 layout/paint 抖动（P0：web.dev animations、MDN）。 
- 超越：比「尽量用 transform」更硬 — **默认仅四类**（+ 平台等价）。

## Web 白名单

| 属性 | 允许 | 备注 |
|------|------|------|
| `transform` | ✓ | translate / scale / rotate；优先 `translate3d`/`translateZ(0)` 仅在有测量依据时 |
| `opacity` | ✓ | |
| `filter` | ✓ | 慎用重 filter（blur 大半径）；须单独占预算份额 |
| `clip-path` | ✓ | 复杂 path 动画须测量；超预算减配为硬切 |
| `top` / `left` / `right` / `bottom` | ✗ 关键默认 | 改用 `transform` |
| `width` / `height` / `margin` / `padding` | ✗ 关键默认 | 布局用最终态；过渡用 scale 等近似或取消动画 |
| `box-shadow`（大面积动画） | ✗ 关键默认 | 可静态；动画阴影易掉帧 → 减配去掉 |

非关键（装饰、一次性）：仍**宜**白名单；若破例须登记 + 测量 + 不挤占关键预算。

## 平台等价（摘要；细节 `08`）

| 平台 | 等价「便宜」轴 | 避免 |
|------|----------------|------|
| SwiftUI | `opacity`、`scaleEffect`、`offset`、`rotationEffect` | 每帧改 layout 依赖的尺寸动画作关键默认 |
| Compose | `Modifier.graphicsLayer`（alpha/translation/scale/rotation） | 动画 `width`/`height` Dp 作关键默认 |

## 步骤规格（实现自写）

1. 从 Motion Registry 取关键动效属性列表。 
2. 逐属性对照本表白名单（或平台等价表）。 
3. 任一禁止属性 → 改写为白名单实现，或从关键降为非关键并减配；**禁止**带禁属性合并。 
4. Code review / lint 探针：关键 CSS/`@keyframes`/style 动画声明不含禁属性名（可用简单 rg 门禁，见 `commands`）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 关键含 `top`/`width` 等 | `WHITELIST_VIOLATION`；阻塞 |
| `filter: blur(20px)` 超预算 | 减配 blur 半径或改 opacity；见 `07` |
| 第三方组件动画禁属性 | 禁入关键；或包一层只暴露白名单 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 登记属性 ⊆ 白名单 | pass |
| 登记含 `left` | WHITELIST_VIOLATION |
| hover 仅 `transform`+`opacity` | pass |
