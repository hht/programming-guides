# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。  
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01`；显式 UiState；禁默认 LiveData |
| 工具链 | [ ] | `01` + Version Catalog/lock |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无多余 Manager/第二状态源 |
| 逻辑清晰可测 | [ ] | `05`/`09`；Turbine + UI Test |
| 关键路径 | [ ] | UiState Lifecycle（`05`） |
| 测试 | [ ] | `09` 矩阵 |
| 安全 | [ ] | token 存放（INPUTS §5）；禁明文 session prefs |
| 无障碍 / 性能 | [ ] | INPUTS §12 或裁剪一行 |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有 → 实现仓必做（用户可感知）

| 能力 | 何时必勾 | sources | 勾选 |
|------|----------|---------|------|
| Compose 屏幕 + 四态（loading/empty/error/success） | 全 | compose-samples · nowinandroid · tivi | [ ] |
| Navigation 进出（层级/目的地） | 全 | compose-samples · nowinandroid · tivi | [ ] |
| 配置变更后关键状态保留 | 全 | P0 ViewModel/SavedState · nowinandroid · tivi | [ ] |
| 鉴权门闸 | **仅 INPUTS §5 启用**；否则 N/A | auth 册 + 标杆 | [ ] / N/A |

> ViewModel / Flow / 可测 → §A。UiState 硬门闸与配置恢复书面策略 → §C 超越，**不**伪称共有。

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条  
2. [ ] 共有判定：≥2 证据源；仅 1 源 → 可选  
3. [ ] 功能面：指南必做 ⊇ 共有  
4. [ ] 工程面：§1.2 有章节  
5. [ ] 超越 a+b：  
   - [ ] a1. `对照：B 中更弱/未见「每屏单一不可变 UiState 为唯一业务真相、禁止 Composable 旁路可变真源」硬门闸 → 本指南要求 UiState data class 单一不可变真相，event 只经 ViewModel/reducer（见 03、05）`  
   - [ ] a2. `对照：B 中更弱/未见「配置变更与进程恢复策略必须书面钉死」硬门闸 → 本指南要求 INPUTS §8 + SavedState/磁盘最小键，配置变更后状态不丢（见 07、09#4）`  
   - [ ] b. `09` 发版矩阵  
   - c. N/A（证据源含开源仓）  

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；[ui-state-matrix](./templates/ui-state-matrix.md) 已填  
- [ ] UiState Lifecycle 单测 / Turbine 绿  
- [ ] `09` 矩阵 **1–5 + 7** 绿；6 按鉴权适用  
- [ ] 无默认 LiveData UiState；Hilt 仅在书面启用时出现  
- [ ] staging/prod 环境成对（值不在仓）  
