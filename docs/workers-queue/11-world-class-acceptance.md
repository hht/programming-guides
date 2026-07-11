# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` 显式后端；禁伪队列 |
| 工具链 | [ ] | PG≥16 SKIP LOCKED 或 Redis≥7 Streams |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二套队列 SSOT；指南无业务实现 |
| 逻辑清晰可测 | [ ] | `05`/`07`/`09` |
| 关键路径 | [ ] | Job Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | payload 无密钥明文惯例；密钥不入库；权限按应用册 |
| 无障碍 / 性能 | [ ] | 裁剪：无产品 UI；并发/超时预算见 INPUTS |
| 运维第三方 | N/A | **不进必勾**（APM/托管仪表仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（用户可感知且 ≥2 源）。幂等键硬必填属 **超越 a1**，不在本表；实现仓仍须满足 `07` / §C a1 / §D。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| 后台任务入队并由 Worker 执行 | 全 | https://github.com/riverqueue/river · https://github.com/sidekiq/sidekiq · https://github.com/taskforcesh/bullmq | [ ] |
| 失败自动重试（有上限） | 全 | https://github.com/riverqueue/river · https://github.com/sidekiq/sidekiq · https://github.com/taskforcesh/bullmq | [ ] |
| 超限死信可查询 | 全 | https://github.com/riverqueue/river · https://github.com/sidekiq/sidekiq · https://github.com/taskforcesh/bullmq | [ ] |
| 可配置尝试次数 / 退避 | 全 | https://github.com/riverqueue/river · https://github.com/sidekiq/sidekiq · https://github.com/taskforcesh/bullmq | [ ] |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户/运维可感知；非「整站一条」） 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中幂等/唯一 Job 常为可选或库扩展 → 本指南要求每条 Job 必填 idempotency_key，冲突默认 reject（见 07）` 
 - [ ] a2. `对照：B 中可见「进程内延时/简化演示」或未统一禁伪队列 → 本指南禁止 setTimeout/内存数组冒充生产队列，且 visibility_timeout 与 max_attempts 必须写明或进 INPUTS（见 00/06/08）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w） 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；后端互斥已遵守 
- [ ] Job Lifecycle 单测绿（`05`/`09`） 
- [ ] 幂等 + 死信探针绿 
- [ ] staging/prod 存储 URL 成对（值不在仓） 
- [ ] 无 setTimeout 伪队列路径 
