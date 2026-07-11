# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。  
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾；条件行见 B 注）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01`；显式 command / capability |
| 工具链 | [ ] | Tauri 2 + Rust + Vite + 前端册 |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无平行 IPC；无 *Manager 套壳 |
| 逻辑清晰可测 | [ ] | `04`/`06`/`09` |
| 关键路径 | [ ] | Command Lifecycle（`04`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | capability 最小集 + allowlist + 密钥边界 |
| 无障碍 / 性能 | [ ] | 裁剪：桌面 a11y → 应用册/ui-ux；重活在 Rust/async |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有 → 实现仓必做

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 桌面壳 + 前端 UI（含四态或 N/A 谓词） | 全 | https://github.com/spacedriveapp/spacedrive · https://github.com/hoppscotch/hoppscotch | [ ] |
| invoke / command 本机能力 | 全 | https://github.com/spacedriveapp/spacedrive · https://github.com/hoppscotch/hoppscotch | [ ] |
| 多平台打包（按 INPUTS OS） | INPUTS §2 勾选的 OS | https://github.com/spacedriveapp/spacedrive · https://github.com/hoppscotch/hoppscotch | [ ] / 按 OS |
| 自动更新 | **仅 INPUTS §15**；否则 N/A | spacedrive · hoppscotch（可映射） | [ ] / N/A |
| 鉴权门闸 | **仅 INPUTS §16**；否则 N/A | auth 册 + 标杆 | [ ] / N/A |

> 类型化结果 / capability 最小权限 / command allowlist → §A + §C 超越，**不**伪称共有。

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条  
2. [ ] 共有判定：≥2 证据源；仅 1 源 → 可选  
3. [ ] 功能面：指南条件必做 ⊇ 共有  
4. [ ] 工程面：§1.2 有章节  
5. [ ] 超越 a+b：  
   - [ ] a1. `对照：B 中更弱/未见「按窗 capability 最小权限」硬门闸 → 本指南要求每窗显式 permissions，禁无审查的 * + 宽 default（见 05）`  
   - [ ] a2. `对照：B 中更弱/未见「未声明 command 前端不可达」硬门闸 → 本指南要求 AppManifest::commands allowlist，未列入则 invoke 失败（见 06）`  
   - [ ] b. `09` 发版矩阵适用行  
   - c. N/A（证据源含开源仓，非全 P1w）  

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；已书面为何不走 apple-platforms Mac（或并列交付说明）  
- [ ] Command Lifecycle 单测绿（`09` #1–2）  
- [ ] Allowlist + 未声明拒绝（`09` #3–4）  
- [ ] Capability 最小权限抽样（`09` #5–6）  
- [ ] `09` 矩阵按 OS 适用行  
- [ ] staging/prod 密钥成对（值不在仓）  
