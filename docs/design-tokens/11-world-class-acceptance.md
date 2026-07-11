# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1；色名 SSOT |
| 代码风格 | [ ] | `00` 框架 MUST；`01` DTCG + SD |
| 工具链 | [ ] | Style Dictionary + `tokens:build` |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二套色名/平行源；指南无业务皮肤实现 |
| 逻辑清晰可测 | [ ] | `05`/`09` |
| 关键路径 | [ ] | Token Apply Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | N/A 应用密钥；禁令：产物不可被未授权主题注入当账户真相（主题仅视觉）— 裁剪：无鉴权面则标 N/A |
| 无障碍 / 性能 | [ ] | 对比默认 AA（`03`/`INPUTS` §16）；build 须可进 CI |
| 运维第三方 | N/A | **不进必勾**（Design token SaaS 仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（用户可感知且 ≥2 真公开源）。**变换**仅 A（Style Dictionary）真公开 → 不进本表，见差距表 / `06`；实现仓仍须满足 Token Apply Lifecycle。**Material 非标杆 B**，不作本表证据 URL。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 单一源定义设计 token（色/间距等） | 全 | https://github.com/style-dictionary/style-dictionary · https://github.com/design-tokens/community-group · https://github.com/primer/design | [ ] |
| UI/主题消费语义 token（非散落魔法值） | 全 | https://github.com/style-dictionary/style-dictionary · https://github.com/primer/design | [ ] |
| 文档化 token / 主题模式 | 全 | https://github.com/primer/design · https://github.com/design-tokens/community-group · https://github.com/style-dictionary/style-dictionary | [ ] |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户可感知；非「整站一条」） 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中常见「文档有 token 表，但 UI 仍可散落第二套色名/裸 hex」→ 本指南要求色名 SSOT + consume 禁令 + drift/lint 探针（见 03/07/09）` 
 - [ ] a2. `对照：B 中常见「设计 Variables 与工程 token 路径可不一致」→ 本指南要求启用 ui-ux 时语义路径同名 join key，并有漂移检查（见 04/08）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w） 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；DTCG + Style Dictionary 无双开口 
- [ ] Token Apply Lifecycle 探针绿（`05`/`09`） 
- [ ] 无第二套色名；无组件裸品牌 hex 
- [ ] `tokens:build` + drift 进 `check` 
- [ ] 启用 ui-ux 时路径同名检查绿 
- [ ] 无平行第二 transform 正式路径 
