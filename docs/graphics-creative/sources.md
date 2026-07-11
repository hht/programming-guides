# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| web.dev — Animations | https://web.dev/articles/animations |
| MDN — CSS animations / performance（综合入口） | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations |
| MDN — will-change / transform 相关性能 | https://developer.mozilla.org/en-US/docs/Web/CSS/transform |
| Apple — Energy Efficiency Guide（能效与动画克制） | https://developer.apple.com/library/archive/documentation/Performance/Conceptual/power_efficiency_guidelines_osx/ |

> 冲突：P0 > P1 > P1w。web.dev 同时作 P0 与证据源 A（P1w 文档形态）；以 P0 条款为准。

## 标杆 B（证据源合计 3）

| ID | 仓库或文档 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------------|------|--------|----------|--------------|
| A | [web.dev/articles/animations](https://web.dev/articles/animations) | P1w | 合成器友好属性、性能与动画关系、测量意识 | 当业务视觉规范 | 可预算的 Web 动效性能 |
| B | [pmndrs/react-spring](https://github.com/pmndrs/react-spring) | P1 | 声明式物理/弹簧边界、可中断动画思维 | **钉为默认依赖**；无限弹簧链 | 产品 UI 动效表达 |
| C | [Shopify/flash-list](https://github.com/Shopify/flash-list) | P1 | 列表回收、滚动性能、可测 jank 取向 | 绑死 React Native；当 Web 唯一实现 | 高性能列表/滚动 |

### 学习参考（不计入 3 证据源缺额；冲突表用）

| 仓 | 用法 |
|----|------|
| [motiondivision/motion](https://github.com/motiondivision/motion) | 学 API/手势边界；**禁止**钉默认 |
| [argyleink/open-props](https://github.com/argyleink/open-props) | 可学 easing/token；非动效性能标杆 |

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 优先合成器友好属性（transform/opacity 等） | ✓ | ✓ | —/映射 | 必做 |
| 避免动画引起 layout 抖动 | ✓ | ✓ | ✓（列表） | 必做 |
| 掉帧/性能可测（有通过谓词） | ✓ | —/弱 | ✓ | 必做（≥2：A+C） |
| 长列表虚拟化/回收 | — | — | ✓ | **条件必做**：INPUTS 有长列表 |
| 弹簧/声明式动效库 | — | ✓ | — | **可选**（学，非默认） |

> 「超预算减配阶梯 / 帧预算数字硬门闸」→ **仅超越**（差距表 + `11`§C a2/a3），**不进本表**。

## 差距表

| 缺口 | 来自标杆 | 类型 | 落入文件 | 必做/可选/参考 |
|------|----------|------|----------|----------------|
| 属性白名单（transform/opacity/filter/clip-path） | A + P0 MDN | 功能/工程 | `03-property-whitelist.md` | 必做/超越 |
| 每关键动效帧预算数字 | A 精神 + 本册强化 | 工程 | `04` / `05` | 必做/超越 |
| Frame Budget Lifecycle 编号步骤 | A,C | 工程 | `05-frame-budget-lifecycle.md` | 必做 |
| Chrome Performance / Instruments / GPU | A + P0 Apple | 工程 | `06-measurement.md` | 必做 |
| 超预算减配阶梯 | 超越 vs A/B/C | 工程/超越 | `07-degrade-and-tier.md` | 必做/超越 |
| 禁 Framer/GSAP/Lottie 默认 | 先进性裁决 | 工程 | `01` / `05` | 必做 |
| 长列表性能策略 | C | 功能 | `INPUTS` §9 / `08` | 条件必做 |
| react-spring / Motion 默认依赖 | B | — | — | **禁止默认**；可选学 |
| Sentry/APM | — | 参考 | — | 参考；**不进必勾** |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| 流行 Framer Motion / GSAP / Lottie vs CSS+rAF | **钉 CSS 白名单 + rAF/IO**；重库非默认（先进可测/可预算 > 下载量） |
| react-spring / Motion 表达力强 | **可学边界，不钉默认依赖**；关键路径仍过白名单与预算 |
| open-props vs 性能标杆 | open-props 不作证据源 C；C 用 flash-list |
| Material Design Lite / Victory 作标杆 | **弃用**；改 flash-list（性能向） |
| 120 fps 全面默认 | **默认 60**；120 须 INPUTS 设备档 |
| prefers-reduced-motion 产品要「不降级」 | 允许书面例外，**仍须预算与测量**；默认仍尊重系统 |
