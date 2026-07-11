# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| Cloudflare Workers · Fetch Handler | https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/ |
| Cloudflare Workers · Limits | https://developers.cloudflare.com/workers/platform/limits/ |
| Wrangler · configuration | https://developers.cloudflare.com/workers/wrangler/configuration/ |
| WHATWG Fetch | https://fetch.spec.whatwg.org/ |
| AWS Lambda · 重试（条件平台对照） | https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [cloudflare/workers-sdk](https://github.com/cloudflare/workers-sdk) | P1 | Wrangler 项目、本地/预览 invoke、配置与部署面 | 照搬 SDK 内部实现细节 / 抄实验命令当产品 SSOT | 用 Workers 工具链开发并调用边缘函数 |
| B | [honojs/hono](https://github.com/honojs/hono) | P1 | Web Standards 路由与 handler 组合、边缘可移植入口 | 约定多运行时任选为「第二默认平台」 | 在边缘用 fetch 风格处理 HTTP 并返回响应 |
| C | [aws-powertools/powertools-lambda-typescript](https://github.com/aws-powertools/powertools-lambda-typescript) | P1 | 超时/幂等/中间件习惯、可测 handler | 约定 Lambda 为默认边缘；抄商业观测为必勾 | 在 Functions 上落地可运维的调用与失败语义 |

映射学习（非 B 共有证据源、不作默认）：[opennextjs/opennextjs-cloudflare](https://github.com/opennextjs/opennextjs-cloudflare)、[middyjs/middy](https://github.com/middyjs/middy)、Vercel Functions 公开文档 — 仅 INPUTS 选 OpenNext/Vercel 或对照中间件时引用。

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| HTTP（或文档化触发）调用并得到响应 | ✓ | ✓ | ✓ | **必做** |
| 失败/错误对调用方可感知（非无限挂起当成功） | ✓ | ✓ | ✓ | **必做** |
| 环境/密钥与代码分离 | ✓ | ✓ | ✓ | **必做** |
| 托管仪表盘 / 商业 APM | ✓ | — | 可 | **参考**（不进必勾） |

> **共有必做**仅上表用户可感知且 ≥2 源证据的能力。墙钟/CPU 预算将、写路径幂等硬必填 **不进共有**（B 中常规定为平台默认或可选中间件）→ 见差距表「超越」与 `11` §C a1/a2。**本地或等价预览后再部署**仅 A（workers-sdk）强证据，**不进共有** → 见差距表工程面（Workers 默认路径仍见 `03`/`09`）。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Invocation Lifecycle 编号步骤 | A,B,C | 功能 | `05` | 必做 |
| Workers 默认入口 + Hono | A,B + P0 | 工程 | `01`/`03` | 必做（默认平台） |
| 本地或等价预览后再部署 | A（强；B/C 非共有证据） | 工程 | `03`/`09` | 工程（Workers 默认路径；**非共有**） |
| OpenNext / Lambda 映射 | INPUTS | 工程 | `03` | 条件 |
| 触发与路由表 | A,B | 功能 | `04` | 必做 |
| 冷/热 + 预算写明 | 超越 a1 + P0 limits | 工程 | `06`/INPUTS | 超越（指南硬必填） |
| 写路径幂等硬必填 | 超越 a2 + C | 工程 | `07` / `11` §C a2 | 超越（指南硬必填） |
| 超时 → TIMEOUT 可感知 | A,C + P0 | 功能 | `07`/`08` | 必做 |
| Secrets / 绑定 | A + P0 | 工程 | `08` | 必做 |
| 禁双默认 / 禁常驻冒充 | 工程 | 工程 | `00`/`01` | 必做 |
| APM / 托管仪表 | A,C | 参考 | — | 参考 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Vercel Functions / Lambda 心智份额与下载更大 | **不作默认边缘**；**采用 Cloudflare Workers + TypeScript**（先进优先：Web Standards、边缘一体、Wrangler） |
| OpenNext 与 Workers「都能跑 Next」 | OpenNext/Vercel **仅** INPUTS 互斥备选；**禁止**与 Workers 双默认 |
| AWS Lambda 生态成熟 | **条件 INPUTS**；学 Powertools 的超时/幂等习惯，**不**改默认平台 |
| Express / Koa 熟悉 | **禁**作 Workers 默认；**采用 Hono** |
| 自建常驻 Node「也算 serverless」 | **禁止**本册验收路径 |
| 宣称 exactly-once | **禁止**（未另证）；异步默认 **at-least-once + 幂等** |
