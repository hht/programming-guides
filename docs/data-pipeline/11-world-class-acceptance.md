# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `00` 框架 MUST + [python Language Gate](../meta/language-gates/python.md)（常见宿主）；`01` Runner |
| 工具链 | [ ] | PG≥16 + workers-queue（或条件编排书面） |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二套管线 SSOT；指南无业务实现 |
| 逻辑清晰可测 | [ ] | `05`/`07`/`09` |
| 关键路径 | [ ] | Batch Job Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | 源/目标密钥不入库；暂存路径按 env 隔离；权限按应用册 |
| 无障碍 / 性能 | [ ] | 裁剪：无产品 UI；批窗口/超时预算见 INPUTS |
| 运维第三方 | N/A | **不进必勾**（托管编排仪表 / APM 仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（用户/数据消费者可感知且 ≥2 源）。verify 硬门闸与 workers-queue 默认属 **超越**，另见 §C / §D。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 从配置的源抽取数据 | 全 | https://github.com/airbytehq/airbyte · https://github.com/meltano/meltano | [ ] |
| 变换为可分析/可消费形态 | 全 | https://github.com/dbt-labs/dbt-core · https://github.com/meltano/meltano | [ ] |
| 装载到配置的目标 | 全 | https://github.com/airbytehq/airbyte · https://github.com/meltano/meltano | [ ] |
| 运行后可做测试/校验再视为完成 | 全 | https://github.com/dbt-labs/dbt-core · https://github.com/meltano/meltano | [ ] |
| 以可调度的离散 Job/流水线运行 | 全 | https://github.com/airbytehq/airbyte · https://github.com/meltano/meltano · https://github.com/dbt-labs/dbt-core | [ ] |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户/数据消费者可感知；非「整仓一条」） 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中同步/模型跑通常即可标成功，应用级 VerifyCheck 弱或不统一 → 本指南要求 verify 硬门闸，未通过不得 succeeded（见 07/05）` 
 - [ ] a2. `对照：B 中编排器常为默认入口 → 本指南默认 workers-queue 承载 Batch Job，Airflow/Dagster 仅 INPUTS 条件启用（见 01/08）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w） 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；模式 / Runner 互斥已遵守 
- [ ] Batch Job Lifecycle 单测绿（`05`/`09`） 
- [ ] verify 失败不得 succeeded；水位探针绿 
- [ ] 幂等装载 +（默认）死信探针绿 
- [ ] staging/prod 连接名成对（值不在仓） 
- [ ] 无裸 cron / 无未勾选编排器依赖 
