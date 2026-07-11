# Email Delivery — 事务邮件·模板·投递指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **事务邮件投递**：模板合成、入队/发送、供应商确认、退信/投诉处置。 
> **默认栈**：**模板 SSOT（版本化 HTML/文本 + 变量契约）** + **投递状态机（应用侧）** + **幂等键必填**；HTTP 发信适配器对接 **INPUTS 互斥任选的恰好一家**供应商（Resend / Postmark / Amazon SES / 其它书面）；异步路径**可选**对齐 [workers-queue](../workers-queue/README.md) Job Lifecycle。**禁止**把本册写成某家 SDK 百科；**禁止**同步 `setTimeout` / 进程内数组冒充投递队列。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

业务事件触发一封**事务邮件**：按模板合成 → 可靠提交供应商 → 记录投递状态 → 对 bounce / complaint 做抑制与可查询处置；同一发送意图不因至少一次投递产生重复出站。

## 核心正确性路径

**Transactional Send Lifecycle**（[05](./05-transactional-send-lifecycle.md)）：

`compose template → enqueue/send → provider ack → bounce/complaint handling`（编号步骤）。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；供应商互斥已约定 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`） 
3. 必读 [03](./03-templates-ssot.md) + [04](./04-enqueue-and-send.md) + [05](./05-transactional-send-lifecycle.md) 
4. 落地 [06](./06-provider-ack-and-delivery-state.md) / [07](./07-idempotency.md) / [08](./08-bounce-complaint-suppression.md) 
5. 若 INPUTS 勾选异步队列 → 对接 [workers-queue](../workers-queue/README.md)（本册仍拥有模板 + 投递状态机 SSOT） 
6. [commands.md](./commands.md) `check` 绿 
7. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；供应商互斥 / 模板清单 / 数字门闸 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-templates-ssot.md) | 模板 SSOT 与 compose |
| [04](./04-enqueue-and-send.md) | 入队/发送与事务边界 |
| [05](./05-transactional-send-lifecycle.md) | **Transactional Send Lifecycle（核心）** |
| [06](./06-provider-ack-and-delivery-state.md) | Provider ack 与投递状态机 |
| [07](./07-idempotency.md) | 幂等键与出站去重 |
| [08](./08-bounce-complaint-suppression.md) | Bounce / complaint / 抑制表 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1w/差距表 |
| [templates](./templates/README.md) | schema / env / 状态矩阵例 |
