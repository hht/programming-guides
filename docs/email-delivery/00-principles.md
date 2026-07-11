# 00 — 原则与不变量

## 品类

业务事件触发一封**事务邮件**：按模板合成 → 可靠提交供应商 → 记录投递状态 → 对 bounce / complaint 做抑制与可查询处置；同一发送意图不因至少一次投递产生重复出站。

## 核心正确性路径（全文唯一）

**Transactional Send Lifecycle**：**compose template → enqueue/send → provider ack → bounce/complaint handling**。规格见 [05](./05-transactional-send-lifecycle.md)。模板见 `03`；入队/发送见 `04`；状态机见 `06`；幂等见 `07`；bounce/complaint 见 `08`——**不替代**本路径名。

## 硬不变量

1. **模板 SSOT**：生产事务信正文来自版本化模板 + 变量契约（`03`）；禁止业务 handler 内散落硬编码整封 HTML 作唯一源。  
2. **供应商互斥**：INPUTS **恰好钉一家**；适配器可换，**投递状态机与幂等语义不随供应商分叉**。  
3. **每封发送意图必有 `idempotency_key`**；冲突按 INPUTS（默认 reject）。  
4. **应用侧投递状态机为真相**（`06`）；供应商事件用于推进状态，禁止「只查供应商仪表、本地无记录」。  
5. **投递语义默认 at-least-once**（尤其异步路径）；出站 **必须**按幂等设计；禁止无幂等却宣称 exactly-once。  
6. **Webhook 必须验签**（或等价 mTLS / SNS 订阅确认策略，INPUTS 书面）；验签失败 → `EMAIL_WEBHOOK_INVALID`，不推进状态。  
7. **hard bounce / complaint → 抑制表**；被抑制地址默认拒绝新发送（`EMAIL_SUPPRESSED`），除非 INPUTS 书面覆盖流程。  
8. **禁止**用 `setTimeout`、进程内数组、无持久化 channel 冒充生产投递队列。  
9. **deletion-first**：无平行第二套「邮件产品」SSOT；无 `*EmailManager` 领域主名（见 `02`）。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 供应商选择 / From / 模板清单 / 数字 | `INPUTS.md` |
| 模板形状与 compose | `03-templates-ssot.md` + templates |
| 入队/发送事务边界 | `04-enqueue-and-send.md` |
| Lifecycle 步骤 | `05-transactional-send-lifecycle.md` |
| 投递状态枚举与转移 | `06-provider-ack-and-delivery-state.md` |
| 幂等键与出站去重 | `07-idempotency.md` |
| Bounce / complaint / 抑制 | `08-bounce-complaint-suppression.md` |
| 异步 Job 认领/重试/死信（若勾选） | [workers-queue](../workers-queue/README.md) |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行发信业务模块 / 真密钥  
- 某家供应商 SDK 百科替代状态机规格  
- 无幂等键出站  
- 未验签 Webhook 直接改状态  
- 营销群发与事务发送混用同一无隔离队列（未在 INPUTS §16 书面）  

## 超越（对照写入 11）

1. `对照：B 中模板常为控制台拖拽或示例 HTML 散落 → 本指南要求版本化模板 SSOT + 变量契约，compose 失败不得出站（见 03/05）`  
2. `对照：B 中幂等常为供应商可选头或短 TTL → 本指南要求应用侧 idempotency_key 必填 + 投递状态机持久化，供应商键为叠加而非唯一去重（见 06/07）`  
