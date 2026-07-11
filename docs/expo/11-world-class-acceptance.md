# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | §0 三准则经由 meta/language-gates/typescript.md 硬门闸落实 + commands lint 绿 |
| 工具链 | [ ] | `01` + lockfile + `expo install` |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无多余 Manager/第二状态源；无默认 eject |
| 逻辑清晰可测 | [ ] | `05`/`09`；Jest + RNTL |
| 关键路径 | [ ] | Screen State Lifecycle（`05`） |
| 测试 | [ ] | `09` 矩阵 |
| 安全 | [ ] | token → SecureStore（INPUTS §6）；禁明文 session |
| 无障碍 / 性能 | [ ] | INPUTS §14 或裁剪一行 |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有 → 实现仓必做（用户可感知）

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 移动屏可导航使用（路由） | 全 | https://github.com/expo/expo · https://github.com/expo/examples | [ ] |
| 屏四态：loading/empty/error/success | 全 | https://github.com/expo/examples · https://github.com/facebook/react-native | [ ] |
| 登录/会话门闸（若产品有） | **仅 INPUTS §6 启用**；否则 N/A | auth 册 + https://github.com/expo/examples | [ ] / N/A |
| 调用设备能力（相机/通知等，若声明） | **仅 INPUTS 声明模块**；否则 N/A | https://github.com/expo/expo · https://github.com/expo/examples | [ ] / N/A |

> 「失焦取消 inflight」与「原生模块兼容策略」属 **超越必做**（见 §C a1/a2），**不**伪称共有。 
> 工程项（TS、Managed、UiState 形状、可测）进 §A，**不**冒充用户可感知共有。

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户可感知） 
2. [ ] 共有判定：≥2 证据源；仅 1 源 → 可选 
3. [ ] 功能面：指南必做 ⊇ 共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「失焦取消 inflight」硬门闸 → 本指南要求 Screen 失焦取消进行中请求（见 05/07）` 
 - [ ] a2. `对照：B 中更弱/未见「原生模块须声明 Expo 兼容策略」硬门闸 → 本指南要求 INPUTS 写明兼容策略（见 07）` 
 - [ ] b. `09` 发版矩阵 
 - c. N/A 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK` 
- [ ] Screen State Lifecycle 单测/RNTL 绿 
- [ ] `09` 矩阵适用行 
- [ ] staging/prod 环境成对（值不在仓） 
