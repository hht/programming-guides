# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写发信 / Webhook / 模板实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL / 表名 / P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **供应商（互斥任选一家）** | □ **Resend** □ **Postmark** □ **Amazon SES** □ **其它**（须写明理由 + 官方 API/Webhook 文档 URL）— **禁止**「Resend 或 SES 任选」双开口；指南不指定百科，**本项写明运行时一家** |
| 2 | **API 密钥 / 凭证名** | staging/prod **成对**环境变量名（例 `EMAIL_API_KEY` / `AWS_ACCESS_KEY_ID`+`SECRET`）；**值不入库**；禁把密钥写进模板或仓库 |
| 3 | **发信域与 From** | 已验证域名（或 staging 沙箱域）+ 默认 `from` 地址；与供应商控制台一致 |
| 4 | **模板清单（SSOT）** | ≥1 个事务模板：`template_id`、用途一句、必填变量表、locale 策略（□ 单语 □ 多 locale）；禁在业务代码散落硬编码整封 HTML 作生产唯一源 |
| 5 | **幂等键策略** | 每封出站意图 **必填** `idempotency_key`（业务词根+意图维度，见 `07`）；唯一性范围：□ 全局 □ 按 `template_id`；冲突时择一：□ **reject**（默认） □ coalesce（须写明） |
| 6 | **发送路径（互斥任选其一）** | □ **同步直发**（请求内 compose→provider；仅低流量/可丢延迟预算须写明） □ **异步队列**（**推荐**；对齐 [workers-queue](../workers-queue/README.md)，队列名例 `email.send`）— **禁止**未选定而留下双开口 |
| 7 | **Webhook / 事件入口** | 公开 HTTPS 路径（或内部队列转发）+ **签名校验**策略（供应商文档方法名/头名）；staging/prod endpoint **成对** |
| 8 | **投递状态机** | 确认采用本册 `06` 状态枚举（或写明差分表：旧名→本册名）；**禁止**仅以供应商仪表为唯一真相而无应用侧记录 |
| 9 | **Bounce / complaint 策略** | hard bounce → 抑制；complaint → 抑制；soft bounce → 重试上限数字（默认对齐 workers-queue 或约定 **3**）；抑制保留默认 **90 天**或写明 |
| 10 | **错误码表** | 至少：`EMAIL_DUPLICATE` / `EMAIL_TEMPLATE_INVALID` / `EMAIL_SUPPRESSED` / `EMAIL_PROVIDER_REJECTED` / `EMAIL_PROVIDER_UNAVAILABLE` / `EMAIL_WEBHOOK_INVALID` → 应用/HTTP 映射 |
| 11 | **环境成对** | staging/prod：`APP_ENV`、供应商密钥名、Webhook URL、（若异步）队列后端 URL 名 |
| 12 | **应用册对接** | □ go □ fastapi □ nextjs □ 多册 — 本册为 **Transactional Send Lifecycle** SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 13 | **workers-queue INPUTS** | 勾了异步：须另满足 [workers-queue/INPUTS.md](../workers-queue/INPUTS.md)（后端互斥、可见性、max_attempts）；邮件 Job `idempotency_key` **=** 本册发送意图键（同一字符串） |
| 14 | **出站与业务同事务** | 异步默认：业务写与 **email outbox / enqueue** 同事务（对齐 workers-queue `04`）；若拆事务须写明失败补偿方案 |
| 15 | **附件** | □ 不做（默认）□ 做：最大字节、MIME 白名单、禁可执行类型 |
| 16 | **批量 / 营销信** | □ 不做（默认；本册主路径=事务）□ 做：须写明与事务队列隔离（独立 `template_id` 前缀或队列名）+ 退订合规一句 |
| 17 | **供应商 SDK** | □ 官方 HTTP 客户端自封装（默认可）□ 官方 SDK（须版本）；**禁止**同时两套适配器作 SSOT |
| 18 | **禁止清单确认** | 勾选：□ **不**用 `setTimeout`/内存数组冒充投递；□ **不**把供应商控制台当唯一投递真相；□ **不**在未校验签名时信任 Webhook body |

## 供应商裁剪

| 供应商 | 必读章 | 可 N/A |
|--------|--------|--------|
| 任一家（INPUTS §1） | 03–08、06 状态机 | 其它家 SDK 细节（仅 sources 对照） |
| 异步 + workers-queue | workers-queue 03–08 | 同步直发节细节 |
| 同步直发 | 04 同步节、05–08 | workers-queue 认领细节（仍须理解 at-least-once + 幂等） |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
