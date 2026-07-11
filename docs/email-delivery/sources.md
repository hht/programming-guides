# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| Amazon SES 通知内容（bounce/complaint/delivery） | https://docs.aws.amazon.com/ses/latest/dg/notification-contents.html |
| Resend Idempotency Keys | https://resend.com/docs/dashboard/emails/idempotency-keys |
| Postmark Bounce webhook | https://postmarkapp.com/developer/webhooks/bounce-webhook |

## 标杆 B（P1w 为主；ESP 文档事实标准）

> 开源「完整事务邮件产品」与品类一句话匹配且可映射默认栈者不足 3 → 按元指南用 **P1w** 补足至 3。自托管 MTA 作对照学习，**不**约定默认。

| ID | 仓库或文档 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------------|------|--------|----------|--------------|
| A | [Resend — Send Email / Webhooks / Idempotency](https://resend.com/docs/api-reference/emails/send-email) | P1w | API 发信、事件类型、幂等头 | 将 Resend 定为唯一供应商；控制台当应用真相 | 事务邮件 API 发送与事件 |
| B | [Postmark — Email API / Bounce webhook](https://postmarkapp.com/developer/user-guide/send-email-with-api) | P1w | 事务发送、bounce webhook、消息流 | 将 Postmark 定为唯一；抄其服务器模板当唯一 SSOT | 事务邮件发送与退信处理 |
| C | [Amazon SES — Send API / Notifications](https://docs.aws.amazon.com/ses/latest/dg/send-email-api.html) | P1w | 发送 API、SNS 通知内容（bounce/complaint/delivery） | 照搬 AWS 账号百科；把 IAM 教程当本册主体 | 云上发信与投递通知 |

映射学习（非 B 共有证据源、不作默认）：[postal](https://github.com/postalserver/postal) 自托管 MTA — 仅当 INPUTS「其它」自建时对照运维面。

## 共有能力切条（用户 / 运维可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 经 API 发送事务邮件 | ✓ | ✓ | ✓ | **必做** |
| 消费投递相关事件（delivered/bounce 等） | ✓ | ✓ | ✓ | **必做** |
| Bounce/投诉后抑制无效地址 | ✓ | ✓ | ✓ | **必做** |
| 托管仪表盘 / 供应商 UI | ✓ | ✓ | ✓ | **参考**（不进必勾） |
| 控制台拖拽模板当唯一源 | 可 | 可 | 可 | **可选/不强制**；本指南升格仓库模板 SSOT 为超越 |

> **共有必做**仅上表用户/运维可感知且 ≥2 源证据的能力。应用侧状态机 + 版本化模板 SSOT + **应用侧幂等键必填** **不进共有**（B 中幂等常为可选头/短 TTL 或证据弱；与超越 a2 对齐）→ 见差距表「超越」与 `11` §C。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Transactional Send Lifecycle 编号步骤 | A,B,C | 功能 | `05` | 必做 |
| 模板版本 + 变量契约 | 超越 a1 | 工程 | `03` | 超越（指南硬必填） |
| 应用侧投递状态机 | 正确性 | 工程 | `06` | 必做 |
| 幂等键应用侧必填 | 超越 a2 / A | 工程 | `07` | 超越（指南硬必填） |
| Webhook 验签 | A,B,C | 安全 | `08`/INPUTS | 必做 |
| Bounce/complaint 抑制 | B,C,A | 功能 | `08` | 必做 |
| 异步 outbox + workers-queue | 工程 | 工程 | `04` | 条件（异步） |
| 禁 setTimeout 伪队列 | 工程 | 工程 | `00`/`01` | 必做 |
| 供应商 SDK 百科 | — | 参考 | — | 参考（不进正文 SSOT） |

## 冲突

| 冲突 | 裁决 |
|------|------|
| 哪家 ESP 下载/口碑第一 | **不**定默认；**INPUTS 互斥约定恰好一家**；指南约定模板+幂等+状态机 |
| 供应商控制台模板 vs 仓库模板 | **仓库/版本化模板为应用 SSOT**；控制台仅可作预览，不得当唯一生产源 |
| 供应商幂等 TTL（如 24h）vs 业务去重 | **应用侧唯一约束与状态行**为去重真相；供应商键叠加 |
| 同步直发 vs 队列 | **推荐异步**；同步须在 INPUTS 写明；二者互斥任选 |
| 宣称 exactly-once | **禁止**（未另证）；默认 **at-least-once + 幂等** |
| Postal 等自托管 | 仅 INPUTS「其它」；不替换状态机规格 |
