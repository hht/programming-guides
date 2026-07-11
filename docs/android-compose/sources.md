# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| Jetpack Compose | https://developer.android.com/jetpack/compose |
| Guide to app architecture | https://developer.android.com/topic/architecture |
| ViewModel overview | https://developer.android.com/topic/libraries/architecture/viewmodel |
| Saved State module for ViewModel | https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-savedstate |
| Navigation Compose | https://developer.android.com/guide/navigation/navigation-getting-started |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [android/compose-samples](https://github.com/android/compose-samples) | P1 | Compose UI 模式、状态与导航示例 | 把 demo 目录当业务词表圣经 | Compose 交付示例集 |
| B | [android/nowinandroid](https://github.com/android/nowinandroid) | P1 | 现代架构、多模块、UiState/Flow、测试 | 强制抄其全部模块切分 | 生产级 Compose 应用架构 |
| C | [chrisbanes/tivi](https://github.com/chrisbanes/tivi) | P1 | Compose + 单向数据流、复杂 UI 状态 | 绑定其具体后端/产品 | Compose 应用工程实践 |

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| Compose 屏幕 + 四态（loading/empty/error/success） | ✓ | ✓ | ✓ | 必做 |
| 导航进出（Navigation Compose） | ✓ | ✓ | ✓ | 必做 |
| 配置变更后关键状态仍在（不丢用户进度） | P0 + B/C | ✓ | ✓ | 必做 |
| 鉴权门闸 | 视样本 | ✓ | — | 条件：INPUTS §5 |

> ViewModel / Coroutines·Flow / 可测 / Hilt → **工程面 §1.2**（`01`/`09`/`11`§A），不作功能共有。  
> 「单一不可变 UiState」「配置恢复策略书面钉死」→ **超越**（`11`§C a1/a2）。

## 差距表

| 缺口 | 来自标杆 | 类型 | 落入文件 | 必做/可选/参考 |
|------|----------|------|----------|----------------|
| 屏四态可见（loading/empty/error/success） | A,B,C | 功能 | `04` + templates | 必做 |
| 导航进出 | A,B,C | 功能 | `06` | 必做 |
| 配置变更后用户进度仍在 | P0,B,C | 功能 | `07` | 必做 |
| UiState 单向流 + ViewModel | A,B,C + P0 | 工程 | `03`、`05` | 必做 |
| 屏幕状态矩阵（交付物） | A,B,C | 工程 | `04` + templates | 必做 |
| Flow / Repository 边界 | B,C | 工程 | `08` | 必做 |
| 配置变更 / SavedState **书面策略**（INPUTS §8） | 超越 vs B | 工程/超越 | `07`、INPUTS | 必做/超越 |
| Turbine + Compose UI Test | B,C | 工程 | `09` | 必做 |
| 禁 LiveData 默认 | P0 先进 Compose 路径 | 工程 | `01`、`03` | 必做 |
| Hilt | B,C | 工程 | `01`、INPUTS | 可选 |
| 可观测/Sentry 类 | — | 参考 | — | 参考；**不进必勾** |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| Hilt 在 Now in Android / Tivi 很常见 vs 小应用构造注入更简 | **默认构造注入/简单工厂**；Hilt 仅 INPUTS 书面（先进性=可测边界清晰，不强制框架） |
| LiveData 仍常见于旧文 | **禁作默认**；Compose 路径用 StateFlow（先进性 > 旧教程流行度） |
| 多模块强制 vs 单模块 | 单模块允许；依赖方向与词根仍须遵守 `02` |
| compose-samples 目录习惯 vs 业务命名 | 样本可参考；**词表/目录以本册 Pass1 为准** |
