# 01 — 栈

| 层 | 选择 |
|----|------|
| **模板** | 版本化 **HTML + plain text**（或 MJML→HTML 构建步，INPUTS 写明）；变量契约 JSON Schema / 类型；**仓库或 DB 版本表二选一写明**（默认：仓库 `templates/email/<template_id>/vN/`） |
| **投递真相** | 应用侧 **email_messages**（或等价）表/记录 + [06](./06-provider-ack-and-delivery-state.md) 状态机 |
| **供应商适配** | 单一 `EmailProvider` 端口；INPUTS 约定实现：**Resend** / **Postmark** / **Amazon SES** / 其它书面 — **HTTP API 优先**；官方 SDK 可选但不得双 SSOT |
| **异步（推荐）** | 对齐 [workers-queue](../workers-queue/README.md)：默认 **PG SKIP LOCKED** 或 INPUTS 选 Streams；队列名例 `email.send` |
| **同步（可选）** | 仅 INPUTS 勾选同步直发；仍须写投递记录 + 幂等 + 可测状态转移 |
| 禁止冒充 | **`setTimeout` / 内存队列** 不得进入验收路径 |

禁止：留下「Resend 或 SES 任选」开口；无应用侧状态表仅依赖供应商 UI；生产无 Webhook 验签。

## 脚手架

```bash
# 1) 复制 templates/email-template.schema.json + email-message.schema.json → 实现仓契约
# 2) 落模板目录或迁移：按 INPUTS §4 template_id 清单
# 3) 配置 staging/prod EMAIL_API_KEY（或 SES 凭证名）；值不入库
# 4) 异步：对齐 workers-queue 脚手架；handler = compose→provider submit→写 submitted
# 5) 挂 Webhook 路由：验签 → 映射事件 → 推进状态机（06/08）
```

## 版本

| 项 | 策略 |
|----|------|
| 供应商 API | 跟官方当前稳定版；破坏性变更须改适配器测试，不改状态机枚举语义 |
| 模板 | **显式版本号**（`v1`/`v2`）；已发送消息冻结 `template_version` |
| workers-queue（若用） | 跟该册 PG≥16 或 Redis≥7 |
| 客户端 | 跟应用册 HTTP 客户端；本册不发明第二默认 |

## 冲突裁决（写入 sources）

流行度（某家 ESP 下载/SDK stars）**不**单独定胜负；**模板 SSOT + 幂等 + 投递状态机**优先。供应商只是 INPUTS 约定的适配目标。
