# Serverless — Functions / 边缘运行时指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **Functions / 边缘运行时**：触发、冷/热启动、handler、响应 / 超时 / 重试。  
> **默认栈**：**Cloudflare Workers + TypeScript**（**钉死**默认边缘；先进优先）。  
> **备选（INPUTS 互斥）**：**OpenNext / Vercel Functions**（全栈 Next 部署面）。  
> **条件（INPUTS 勾选）**：**AWS Lambda**（Node/TS 或映射学习；**不**与 Workers 双默认）。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

调用方经 **HTTP / 定时 / 队列等触发** 调用边缘或 Functions：**trigger → cold/warm → handler → response / timeout / retry**；超时与失败对调用方可感知，密钥与代码分离。

## 核心正确性路径

**Invocation Lifecycle**（[05](./05-invocation-lifecycle.md)）：**trigger → cold/warm → handler → response / timeout / retry**（编号步骤）。全文唯一主路径名。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；按「平台互斥」只读适用章  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. 必读 [03](./03-platform-and-entry.md) + [04](./04-trigger-and-routing.md) + [05](./05-invocation-lifecycle.md)；落地 [06](./06-cold-warm-and-budget.md) / [07](./07-timeout-retry-idempotency.md) / [08](./08-response-secrets-bindings.md)  
4. [commands.md](./commands.md) `check` 绿  
5. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；平台互斥 / 超时 / 重试门闸 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-platform-and-entry.md) | Workers / OpenNext / Lambda 入口 |
| [04](./04-trigger-and-routing.md) | 触发与路由 |
| [05](./05-invocation-lifecycle.md) | **Invocation Lifecycle（核心）** |
| [06](./06-cold-warm-and-budget.md) | 冷/热与 CPU/墙钟预算 |
| [07](./07-timeout-retry-idempotency.md) | 超时、重试、幂等 |
| [08](./08-response-secrets-bindings.md) | 响应、密钥、绑定 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | env / wrangler / package-scripts 例 |

## 心智模型

```text
INPUTS → 平台互斥 → trigger → cold|warm → handler → response|timeout|retry → check → 验收
```
