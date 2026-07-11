# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。  
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 平台勾；条件行见 B 注）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 词根 + 依赖 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01`；显式预算、禁无关炫技库 |
| 工具链 | [ ] | `01` + 应用册 lockfile |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无默认重动效库；deletion-first |
| 逻辑清晰可测 | [ ] | `05`/`09` |
| 关键路径 | [ ] | Frame Budget Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 裁剪：动效品类无会话面 → N/A（应用册/auth） |
| 无障碍 / 性能预算 | [ ] | `04` 数字 + `03` 白名单 + reduced-motion（`07`） |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有 → 实现仓必做（按平台）

| 能力 | 何时必勾 | sources | 勾选 |
|------|----------|---------|------|
| 合成器/图层友好属性动画（transform/opacity 等） | 全平台 | https://web.dev/articles/animations · https://github.com/pmndrs/react-spring | [ ] |
| 避免关键路径 layout 抖动动画 | 全平台 | https://web.dev/articles/animations · https://github.com/shopify/flash-list | [ ] |
| 可测量掉帧/帧时间并有通过谓词 | 全平台 | https://web.dev/articles/animations · https://github.com/shopify/flash-list | [ ] |
| 长列表/滚动性能策略 | **仅 INPUTS §9=有长列表** | https://github.com/shopify/flash-list · https://web.dev/articles/animations | [ ] / N/A |
| 声明式弹簧/手势库能力 | **可选**（学 react-spring/Motion；非默认依赖） | react-spring · motion | 可选 |

> 「超预算减配 / 帧预算数字」属 **超越必做**（§C a2/a3 + `07`），**不**伪称共有。

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条  
2. [ ] 共有判定：≥2 证据源；仅 1 源 → 可选  
3. [ ] 功能面：指南条件必做 ⊇ 共有  
4. [ ] 工程面：§1.2 有章节  
5. [ ] 超越 a+b：  
   - [ ] a1. `对照：B（react-spring/Motion）可见更广可动画面、未见「关键路径仅 transform/opacity/filter/clip-path」硬门闸 → 本指南要求关键动效只动画该白名单（或平台等价）（见 03、05）`  
   - [ ] a2. `对照：B 中更弱/未见「每条关键动效强制帧预算数字（fps+ms）否则阻塞」硬门闸 → 本指南要求每条关键 Motion 具备 target_fps 与 frame_budget_ms，无数字不得标完成（见 04、05、09）`  
   - [ ] a3. `对照：B 中更弱/未见「超预算强制减配阶梯、禁加库掩盖掉帧」硬门闸 → 本指南要求 OVER_BUDGET → 07 减配阶梯，禁 Full 档带超预算合并（见 05、07）`  
   - [ ] b. `09` 发版矩阵（按平台适用行）  
   - c. N/A（证据源含开源仓，非全 P1w；P1w web.dev animations 仍作属性/测量对照）

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；平台裁剪已遵守  
- [ ] Frame Budget Lifecycle 单测/状态机绿  
- [ ] `09` 矩阵必绿：  
  - **仅 Web**：行 **1–5**（行 5 仅当 INPUTS §13 书面「不降级」时 N/A；6 若有长列表）  
  - **仅原生**：行 **1–3** + **5** + **7**（行 5 仅 §13「不降级」可 N/A，须接 `08` 系统减动效 API；6 若有长列表）  
  - **Web+原生**：上两者并集  
- [ ] 关键行测量证据非空；无 OVER_BUDGET 残留 Full 档  
- [ ] 未默认引入 Framer/GSAP/Lottie（或例外书面）  
