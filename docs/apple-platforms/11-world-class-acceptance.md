# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾；条件行见 B 注）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` SwiftUI + Observation |
| 工具链 | [ ] | `01` + Xcode / SPM lock |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无上帝 Store；无平行 UIKit 主路径 |
| 逻辑清晰可测 | [ ] | `05`/`09` |
| 关键路径 | [ ] | View-State Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 密钥不入库；token Keychain（若有鉴权） |
| 无障碍 / 性能 | [ ] | HIG / Dynamic Type；重活离主线程（或 INPUTS 裁剪一行） |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有 → 实现仓必做

| 能力 | 何时必勾 | sources | 勾选 |
|------|----------|---------|------|
| 状态驱动主屏（加载/空/错/成功） | 全 | IceCubesApp · EhPanda · UTM | [ ] |
| 用户写操作 + 进行中态 | 全（只读工具 App 须写明「无写」并仍保留 loading/error） | 同上 | [ ] |
| 导航栈进出 | 全 | IceCubesApp · EhPanda | [ ] |
| 设置/偏好入口 | 共有于标杆设置面 | IceCubesApp · UTM | [ ] |
| iPhone 适配 | INPUTS 含 iPhone | IceCubesApp · EhPanda | [ ] / N/A |
| iPad 适配 | INPUTS 含 iPad | IceCubesApp · UTM | [ ] / N/A |
| Mac 窗口 + 菜单 + 键盘 | INPUTS 含 Mac | UTM（+ Whisky 参考） | [ ] / N/A |

> 「可取消异步 / MainActor 回写」属 **超越必做**（§C a1/a2），**不**伪称共有。

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条 
2. [ ] 共有判定：≥2 证据源；仅 1 源 → 可选 
3. [ ] 功能面：指南条件必做 ⊇ 共有（含平台条件） 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「副作用 Task 必须可取消且取消≠致命 error」硬门闸 → 本指南要求 in-flight 可取消、CancellationError→CANCELLED、禁止取消当 NETWORK（见 05、07）` 
 - [ ] a2. `对照：B 中更弱/未见「重活离主线程且 UI 状态更新回 MainActor」硬门闸 → 本指南要求 worker 非 MainActor、UI 字段仅 MainActor 回写（见 05、07、09）` 
 - [ ] b. `09` 发版矩阵（含 Mac 条件行） 
 - c. N/A 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；view-state 矩阵已填 
- [ ] View-State Lifecycle 单测绿（含取消与 MainActor 回写探针） 
- [ ] `09` 矩阵：无 Mac → **1–5**（+8 或裁剪）；含 Mac → **1–7**（+8 或裁剪） 
- [ ] staging/prod xcconfig 成对（值不在仓） 
- [ ] 验收勾选仅 **A+B+D**（跳过 C） 
