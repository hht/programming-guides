# 08 — Bounce / complaint / 抑制

## 不变量

- **hard bounce** 与 **complaint** → 写入 **suppression**（按邮箱规范化地址）；后续发送默认 `EMAIL_SUPPRESSED`。 
- **soft bounce** → 计次；未达上限可留 `submitted` 或供应商重试；达上限 → 按 INPUTS 升 hard 或 `failed`。 
- Webhook **必须验签**；失败不写抑制。 
- 抑制保留默认 **90 天**（INPUTS §9 可改）；过期策略须写明（续期/人工）。

## 步骤规格（实现自写）

### 1. 接收事件

1. 验签 → 解析 `provider_message_id` + 事件类型 + 收件人。 
2. 映射：`bounce`（hard/soft）/ `complaint` / `delivered`（delivered 走 `06`，本文件聚焦负面）。

### 2. 分类

| 事件 | 消息状态 | 抑制 |
|------|----------|------|
| hard bounce | `bounced` | **是**（理由 `hard_bounce`） |
| complaint | `complained` | **是**（理由 `complaint`） |
| soft bounce | 保持或记 `last_error`；计次 | 默认否；超限后按 INPUTS |
| delivered | `delivered` | 否 |

### 3. 抑制表

1. 键：规范化 `email`（小写、Unicode 正规化；**禁**过度「Gmail 点忽略」除非 INPUTS 写明）。 
2. 字段：`reason`、`source_message_id`、`created_at`、`expires_at?`。 
3. 发送路径步骤 2 **先查**抑制表。

### 4. 人工解除（可选）

- 仅运维/支持流程；须审计日志；本册不指定 UI。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 验签失败 | `EMAIL_WEBHOOK_INVALID` |
| 重复 hard bounce | 抑制 upsert 幂等 |
| 被抑制仍被调用 send | `EMAIL_SUPPRESSED`；无 provider 调用 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| hard bounce | `bounced` + suppression 行 |
| complaint | `complained` + suppression |
| 抑制后发送 | `EMAIL_SUPPRESSED` |
| 坏签名 | 无 suppression |
| soft×N 至上限 | 按 INPUTS 终态 |
