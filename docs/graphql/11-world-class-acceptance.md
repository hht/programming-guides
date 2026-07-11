# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 词根 + 依赖 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | §0 三准则经由 meta/language-gates/typescript.md 硬门闸落实 + commands lint 绿 |
| 工具链 | [ ] | `01` + lockfile + codegen/eslint |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无平行 code-first SSOT；无万能 CRUD 层 |
| 逻辑清晰可测 | [ ] | `05`/`09` |
| 关键路径 | [ ] | Operation Lifecycle（`05`） |
| 测试 | [ ] | `09` 矩阵 1–7 |
| 安全 | [ ] | Mutation 鉴权；introspection；OWASP 对照 |
| 无障碍 / 性能 | [ ] | 裁剪：UI a11y → 应用册/ui-ux（本册 API **N/A**）；深度/复杂度见 `07` |
| 运维第三方 | N/A | **不进必勾** |

## B. 功能共有 → 实现仓必做

| 能力 | sources（URL） | 勾选 |
|------|----------------|------|
| Schema / 类型契约 | https://github.com/graphql/graphql-js · https://github.com/graphql-hive/graphql-yoga | [ ] |
| Query 执行 | https://github.com/graphql/graphql-js · https://github.com/graphql-hive/graphql-yoga | [ ] |
| Mutation 执行 | https://github.com/graphql/graphql-js · https://github.com/graphql-hive/graphql-yoga | [ ] |
| Document 校验 | https://github.com/graphql/graphql-js · https://github.com/graphql-hive/graphql-yoga | [ ] |
| 错误进入 `errors[]` | https://github.com/graphql/graphql-js · https://github.com/graphql-hive/graphql-yoga | [ ] |
| Typed document（工程升格必做） | https://github.com/dotansimha/graphql-code-generator · https://github.com/graphql-hive/graphql-yoga | [ ] |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中更弱/未见「introspection staging/prod 默认关或受控」硬门闸 → 本指南要求 staging/prod introspection 默认关闭或经显式 allowlist/鉴权受控（见 07、INPUTS §8）` 
 - [ ] a2. `对照：B 中更弱/未见「写操作必须经鉴权+输入校验、禁公开 mutation 裸奔」硬门闸 → 本指南要求所有 Mutation 经 Session Gate（或等价鉴权）+ 输入校验，禁止未鉴权公开 mutation CRUD（见 06、05）` 
 - [ ] b. `09` 发版矩阵 1–7 
 - c. N/A 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK` 
- [ ] Operation Lifecycle 单测绿（`05`/`09`） 
- [ ] `09` 矩阵 **1–7** 发版绿 
- [ ] staging/prod 密钥与端点成对（值不在仓）；introspection 策略已兑现 
