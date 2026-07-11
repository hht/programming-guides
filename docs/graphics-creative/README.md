# Graphics / Creative — 动效与帧预算指南

> **这是工程指南，不是半成品动效库或可运行 demo。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地可预算、可测量的产品 UI 动效与渲染性能；掉帧可测；**禁止无预算炫技**。 
> **默认栈（Web）**：**CSS `transform` / `opacity`（及白名单内 `filter` / `clip-path`）** + **`requestAnimationFrame` / `IntersectionObserver`**；**禁止**把 Framer Motion / GSAP / Lottie 定为默认依赖。原生可选章：SwiftUI / Compose 动画对齐同一帧预算原则。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

为产品 UI 交付**可预算**的动效与渲染性能；掉帧可测；禁无预算炫技。

## 核心正确性路径

**Frame Budget Lifecycle**（[05](./05-frame-budget-lifecycle.md)）：目标 fps → 动画属性白名单 → 测量 → 超预算则减配。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；按「平台裁剪」只读必读章 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`） 
3. [03](./03-property-whitelist.md) 白名单 + [04](./04-frame-budget-numbers.md) 数字预算登记 
4. 落地 **Frame Budget Lifecycle**（[05](./05-frame-budget-lifecycle.md)）；按 [06](./06-measurement.md) 测量；超预算走 [07](./07-degrade-and-tier.md) 
5. 原生目标另读 [08](./08-native-optional.md)；纯 Web → `08` 标 N/A 
6. [commands.md](./commands.md) `check` 绿 
7. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；平台 / 目标 fps / 关键动效清单 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与禁默认库 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-property-whitelist.md) | 可动画属性白名单 |
| [04](./04-frame-budget-numbers.md) | 帧预算数字与登记 |
| [05](./05-frame-budget-lifecycle.md) | **Frame Budget Lifecycle** |
| [06](./06-measurement.md) | Chrome / Instruments / Android GPU |
| [07](./07-degrade-and-tier.md) | 超预算减配 |
| [08](./08-native-optional.md) | SwiftUI / Compose 可选对齐 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / 登记表例 |
