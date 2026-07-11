# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（按应用册微调；词根不变）
features/notify/                 # 或 features/email/ — 业务能力词根
  send-receipt/                  # 例：发送回执 — enqueue/命令与词根一致
    compose.ts|go|py             # 调模板 SSOT（可内联薄函数）
    enqueue.ts|go|py             # 入队或同步发送入口（禁 EmailManager）
internal/email/                  # 或 src/shared/email/ — 基础设施名允许
  provider.ts|go|py              # EmailProvider 端口 + 一家适配器
  delivery-state.ts|go|py        # 状态转移（对齐 06）
  suppression.ts|go|py           # 抑制表读写
templates/email/<template_id>/vN/
  subject.txt
  body.html
  body.txt
  variables.schema.json          # 与 templates/ 契约对齐
cmd/worker/                      # 若异步：email.send handler
ops/
  email.md                       # 可选：抑制/死信运维（非 APM 必勾）
migrations/                      # email_messages / email_suppressions（及 outbox）
```

依赖方向：`features/<业务> → email 封装 → provider +（可选）queue`；**禁** HTTP handler 内直接散落供应商 SDK 调用且无状态记录。  
状态机 SSOT：本册 `06`；禁第二份「delivery status enum」分叉。  
模板 SSOT：`03` + 模板目录/版本表；禁平行「营销拖拽工具」默认同库无隔离。

UI 状态矩阵：若产品暴露「邮件已发送/失败」，状态名必须用 Pass1 词表（与 `06` 一致）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。  
2. **`template_id`、发送意图、抑制原因** = 业务词根（`receipt.send`、`password.reset`），禁 `mail1`、`tpl_data`、`sendEmailGeneric`。  
3. **禁**技术翻译名进领域模块主名：`*EmailManager`、`*MailService`、`*SenderHelper`、`handleSend*`、`processBounce*`（基础设施可用 `EmailProvider` / `WebhookRouter` 入口例外）。  
4. **禁**同义词分叉：`compose`/`render`/`build` 词表只留一个（本册默认 **`compose`**）；成功提交供应商用 **`submit`**；供应商接受用 **`ack`**（provider ack）；用户投诉用 **`complaint`**（不用 spam_report 作主词，可作别名写入词表一次）。  
5. 对外若暴露 `message_id` / `delivery_state` 字段，协议名冻结在词表。

| 概念 | 正例 | 反例 |
|------|------|------|
| 模板 | `password.reset`、`order.receipt` | `template1`、`html_blob` |
| 操作 | `compose`、`enqueue`、`submit`、`ack` | `handleMail`、`processEmail`、`doSend` |
| 幂等键 | `user:{id}:password.reset:{token_id}` | 仅随机 UUID（无业务维度） |
| 状态 | `queued`、`submitted`、`delivered`、`bounced`、`complained` | `sent2`、`err_flag`、`ok` |
| 抑制 | `suppression`、`hard_bounce`、`complaint` | `blocklist_tmp`、`bad_flag` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| template_id | `dot` 或 `kebab` 分段；全文一种 |
| 表名 | `email_messages`、`email_suppressions`；列 `snake_case` |
| 队列名（若异步） | `email.send`（与 workers-queue 一致） |
| 环境变量 | `EMAIL_API_KEY`（或 SES 钉名）、`EMAIL_FROM`、`EMAIL_WEBHOOK_SECRET`、`EMAIL_PROVIDER` |
| Go 导出 | `PascalCase`；TS/Python 跟应用册 |
