# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

事务邮件：模板合成 → 提交供应商 → 记录状态 → bounce/complaint 抑制；同一意图不重复出站。

## 核心正确性路径（全文唯一）

**Transactional Send Lifecycle**：compose → enqueue/send → provider ack → bounce/complaint。规格见 [05](./05-transactional-send-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 模板 SSOT；禁散落硬编码整封 HTML 唯一源 | `03` |
| F02 | MUST | 供应商互斥；状态机不随商分叉 | INPUTS/`06` |
| F03 | MUST | 每封意图必有 idempotency_key | `07` |
| F04 | MUST | 应用侧投递状态机为真相 | `06` |
| F05 | MUST | 默认 at-least-once；出站幂等 | `07` |
| F06 | MUST | Webhook 验签；失败不推进状态 | `08` |
| F07 | MUST | hard bounce/complaint → 抑制表 | `08` |
| F08 | MUST NOT | setTimeout/内存伪队列冒充生产投递 | `11` |
| F09 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 供应商 / From / 模板清单 | `INPUTS.md` |
| 模板 | `03` |
| 入队/发送 | `04` |
| Lifecycle | `05` |
| 投递状态 | `06` |
| 幂等 | `07` |
| Bounce/complaint | `08` |
| 异步 Job | [workers-queue](../workers-queue/README.md) |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
