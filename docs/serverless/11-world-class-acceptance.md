# 11 — 世界级验收

> §C 为**指南自身**达标（写指南/对抗时勾）。 
> §A + §B + §D 为**实现仓**交付（agent 按 INPUTS 勾）。

## A. 工程面（§1.2）— 实现仓

| 维 | 勾选 | 证据 |
|----|------|------|
| 目录组织 | [ ] | `02` 树 + 依赖方向 |
| 命名 / 词表 | [ ] | 目标仓 `UBIQUITOUS_LANGUAGE.md` = `02` Pass1 |
| 代码风格 | [ ] | `01` 显式平台；禁双默认 |
| 工具链 | [ ] | Workers+Wrangler+TS 或 INPUTS 备选/条件栈 |
| 门禁 | [ ] | `commands.md` |
| 代码极简 | [ ] | 无第二平台 SSOT；指南无业务实现 |
| 逻辑清晰可测 | [ ] | `05`/`07`/`09` |
| 关键路径 | [ ] | Invocation Lifecycle（`05`） |
| 测试 | [ ] | `09` 适用行 |
| 安全 | [ ] | secrets 不入库/不回显；鉴权按 INPUTS/auth 册 |
| 无障碍 / 性能 | [ ] | 裁剪：无产品 UI；墙钟/CPU 预算见 INPUTS/`06` |
| 运维第三方 | N/A | **不进必勾**（APM/托管仪表仅参考） |

## B. 功能共有 → 实现仓必做

> 仅 `sources` **共有必做**（**用户可感知**且 ≥2 源）。超时预算写明、写路径幂等硬必填属 **超越 a***；本地/预览属 **工程面**（非共有，见 `sources` 差距表 / `03`/`09`）。实现仓仍须满足 `06`/`07` / §C / §D。

| 能力 | 何时必勾 | sources（URL） | 勾选 |
|------|----------|----------------|------|
| HTTP（或文档化触发）调用函数并得到响应 | 全 | https://github.com/cloudflare/workers-sdk · https://github.com/honojs/hono · https://github.com/aws-powertools/powertools-lambda-typescript | [ ] |
| 失败/错误对调用方可感知（非无限挂起当成功） | 全 | https://github.com/cloudflare/workers-sdk · https://github.com/honojs/hono · https://github.com/aws-powertools/powertools-lambda-typescript | [ ] |
| 环境/密钥与代码分离（可配置部署） | 全 | https://github.com/cloudflare/workers-sdk · https://github.com/honojs/hono · https://github.com/aws-powertools/powertools-lambda-typescript | [ ] |

## C. §1.3 — 指南达标（维护者勾）

1. [ ] 能力切条（用户可感知；非「整站一条」） 
2. [ ] 共有判定：能力在 \(B\) 的 ≥2 证据源出现；仅 1 源独有 → 可选 
3. [ ] 功能面达到：指南必做 ⊇ 所有共有 
4. [ ] 工程面：§1.2 有章节 
5. [ ] 超越 a+b： 
 - [ ] a1. `对照：B 中冷启动/超时常作平台默认或文档散落 → 本指南要求墙钟超时与 CPU 预算将或进 INPUTS，且 TIMEOUT 必须映射规定为调用方可感知失败（见 06/07）` 
 - [ ] a2. `对照：B 中写路径幂等常为可选中间件 → 本指南要求凡副作用写路径必填幂等维度，冲突默认 reject（见 07）` 
 - [ ] b. `09` 发版矩阵适用行 
 - c. N/A（证据源含开源仓，非全 P1w） 

## D. 实现仓交付门闸（agent 勾）

- [ ] `INPUTS OK`；平台互斥已遵守（无双默认） 
- [ ] Invocation Lifecycle 单测绿（`05`/`09`） 
- [ ] 超时 + 幂等探针绿 
- [ ] staging/prod 密钥/环境成对（值不在仓） 
- [ ] 无常驻进程冒充边缘验收路径 
