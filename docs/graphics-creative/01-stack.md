# 01 — 默认栈（钉死）

> 选栈：**先进优先**（可测、可预算、合成层友好）> 流行度。冲突见 [sources.md](./sources.md)。

## 一句话默认栈

**Web**：**CSS** 动画/过渡（仅白名单属性）+ **`requestAnimationFrame`**（程序驱动）+ **`IntersectionObserver`**（进场触发）；**禁止** Framer Motion / GSAP / Lottie 作默认。  
**测量**：Chrome Performance（Web）；Instruments（Apple）；Android GPU / Profile GPU Rendering（Android）。  
**原生（可选）**：SwiftUI `animation` / `withAnimation`、Compose `Animatable` / `animate*AsState` — **同一**帧预算与白名单原则，见 [08](./08-native-optional.md)。

## 分层钉死

| 层 | 默认 | 禁止 / 备注 |
|----|------|-------------|
| Web 属性 | `transform` / `opacity` / `filter` / `clip-path` | 禁 layout 属性作关键动画默认 |
| Web 触发 | CSS `:hover`/`:focus-visible`、CSS transition/animation、rAF、IO | 禁每帧强制 layout/reflow |
| Web 库 | **无默认动效库** | Framer / GSAP / Lottie **非默认**；例外须 INPUTS + 仍过预算 |
| 学习参考（非默认） | [pmndrs/react-spring](https://github.com/pmndrs/react-spring)、[motiondivision/motion](https://github.com/motiondivision/motion) | 学边界与声明式 API；**不**钉依赖 |
| 列表性能参考 | [Shopify/flash-list](https://github.com/Shopify/flash-list) | 学回收/测量思维；Web 用虚拟化等价，不绑 RN |
| 目标 fps | **60**（16.67 ms） | 120 须设备档；30 仅减配档 |
| 缓动默认 | `ease` / `cubic-bezier(0.22, 1, 0.36, 1)`（见 `04`） | 禁无登记的任意弹簧链爆炸 |

## 脚手架（按应用册）

| 目标 | 动作 |
|------|------|
| React / Next（Vite 或 App Router） | 应用册脚手架后：建 `motion/`（或 `features/<surface>/motion`）登记表 + CSS modules/全局 token；**不** `pnpm add framer-motion` 除非 INPUTS 例外 |
| SwiftUI / Compose | 原生册脚手架 + 本册 `08`；预算登记仍用同一 schema 语义 |

锁版本：应用仓 lockfile；本指南不钉 semver，钉**能力边界**（白名单 + 预算 + 测量）。

## 环境

见 [templates/env.example](./templates/env.example)；多为 feature flag 名，staging/prod 成对。
