# 00 — 原则与不变量

## 品类

调用方经触发调用边缘或 Functions：**trigger → cold/warm → handler → response / timeout / retry**；超时与失败可感知；密钥与代码分离。

## 核心正确性路径（全文唯一）

**Invocation Lifecycle**：**trigger → cold/warm → handler → response / timeout / retry**。规格见 [05](./05-invocation-lifecycle.md)。冷热预算见 `06`；超时/重试/幂等见 `07`；响应与密钥见 `08`——**不替代**本路径名。

## 硬不变量

1. **平台互斥**：默认 **Cloudflare Workers + TypeScript**；OpenNext/Vercel 与 AWS Lambda **仅**经 INPUTS 互斥勾选；**禁止**双默认、双 SSOT。 
2. **全文唯一入口契约**：每个部署单元一个明确 handler 入口（`fetch` / Route Handler / Lambda handler）；禁散落「隐式魔术入口」无文档。 
3. **墙钟超时与 CPU 预算必须写明数字或 INPUTS 必填项**；超时必须映射为调用方可感知失败（默认 `TIMEOUT` / 504），禁止无限挂起当成功。 
4. **写路径副作用必须幂等可重入**（HTTP 调用方重试或异步平台重试）；缺幂等维度的写 → 拒绝或 INPUTS 写明「只读/无副作用」。 
5. **密钥与配置**：Secrets / env 不进源码；staging/prod 成对变量名；绑定资源名进词表或 INPUTS。 
6. **冷启动可发生**：正确性不得依赖「永远 warm」；首次请求仍须完成 Lifecycle 或明确超时。 
7. **deletion-first**：无平行第二套「伪 serverless」长驻进程冒充本册验收路径；无 `*Manager`/`handle*` 领域主名（见 `02`）。 
8. **运维第三方 APM** 不进必勾（见 `11`）。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 平台 / 超时 / 重试 / 触发表 | `INPUTS.md` |
| 入口与平台映射 | `03-platform-and-entry.md` |
| 触发与路由 | `04-trigger-and-routing.md` |
| Lifecycle 步骤 | `05-invocation-lifecycle.md` |
| 冷/热与预算 | `06-cold-warm-and-budget.md` |
| 超时 / 重试 / 幂等 | `07-timeout-retry-idempotency.md` |
| 响应 / 密钥 / 绑定 | `08-response-secrets-bindings.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |
| 全栈 Next 页/路由 | [nextjs](../nextjs/README.md)（本册管 Functions 调用边界） |
| 鉴权通识 | [auth](../auth/README.md) |

## 禁止

- 指南仓堆可运行业务 Worker / Lambda 模块 
- 「Workers 或 Vercel 都行」未选定而留下双开口 
- 无超时预算的生产路径 
- 密钥进 git / 明文日志 
- 用常驻 Node 进程冒充本册边缘验收（未在 INPUTS 改品类） 
- 宣称 exactly-once 却无幂等门闸 

## 超越（对照写入 11）

1. `对照：B 中冷启动/超时常作平台默认或文档散落 → 本指南要求墙钟超时与 CPU 预算将或进 INPUTS，且 TIMEOUT 必须映射规定为调用方可感知失败（见 06/07）` 
2. `对照：B 中写路径幂等常为可选中间件 → 本指南要求凡副作用写路径必填幂等维度，冲突默认 reject（见 07）` 
