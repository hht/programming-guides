# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写 Functions / 边缘实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL / 限制数字 / P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **平台（互斥任选其一）** | □ **Cloudflare Workers + TypeScript**（**默认**） □ **OpenNext / Vercel Functions**（全栈 Next 部署面；书面理由） □ **AWS Lambda**（条件；书面理由：已有 AWS 权威面 / 合规 / 既有事件源）— **禁止**「Workers 或 Vercel 任选」双默认；**禁止**同时把两平台当 SSOT |
| 2 | **入口契约** | Workers：`export default { fetch }`（或 Hono `app.fetch` 挂到同一入口）；OpenNext/Vercel：App Router route / Route Handler 路径固定；Lambda：handler 签名 + 事件源写明（HTTP API / Function URL / SQS 等） |
| 3 | **墙钟超时** | 秒数：**Workers 默认对齐平台 limit（见 `06`；常见请求路径按 INPUTS 写预算秒数，默认墙钟预算 `30`）**；OpenNext/Vercel：**默认 `10`**（Hobby/常见上限以平台规定为准，改则写明）；Lambda：**默认 `30`**（上限 ≤900）；改数字必须写入本项 |
| 4 | **CPU / 计费时间预算** | Workers：CPU time 预算写明或「跟平台 plan limit」+ 监控谓词；其它平台：与墙钟关系写明一句（墙钟 ≥ CPU） |
| 5 | **触发面表** | ≥1 条：`http`（必有至少一条用户可调路径）及可选 `cron` / `queue` / `email`；每条：路径或 cron 表达式、期望 status、业务能力名（Pass1 词根） |
| 6 | **重试策略** | HTTP 同步调用：**默认不自动重试业务副作用**（调用方重试须幂等，见 `07`）；异步触发（queue/cron 失败）：`max_attempts` 默认 **5**；退避默认指数 `base=1s` `cap=900s`；改则约定数字 |
| 7 | **幂等策略（写路径）** | 凡会产生副作用的写：**必填**幂等维度（header `Idempotency-Key` 或业务键）；冲突默认 **reject**；只读 GET 可 N/A |
| 8 | **错误码 / 状态映射** | 至少：`VALIDATION` / `UNAUTHORIZED` / `NOT_FOUND` / `TIMEOUT` / `INTERNAL` → HTTP status（默认 400/401/404/504/500） |
| 9 | **环境成对** | staging/prod：`APP_ENV`、平台账号/项目名、密钥绑定名（Workers Secrets / Vercel Env / Lambda env）；**值不入库** |
| 10 | **应用册对接** | □ 纯 Workers API □ nextjs（OpenNext） □ go/fastapi（仅作上游触发） □ 多册 — 本册为 **Invocation Lifecycle** SSOT |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 11 | **绑定资源表** | Workers：KV / D1 / R2 / Queues / Durable Objects — 列绑定名与用途；无则勾「无绑定」 |
| 12 | **兼容日期 / Node 兼容** | Workers：`compatibility_date` 须填写（YYYY-MM-DD）；若开 `nodejs_compat` 须写明 |
| 13 | **OpenNext 目标** | 勾了 OpenNext：□ Cloudflare（`opennextjs-cloudflare`）□ AWS（`opennextjs-aws`）□ Vercel 托管 — 互斥任选其一 |
| 14 | **Lambda 运行时** | 勾了 Lambda：运行时写明（默认 **nodejs20.x**）；架构 □ x86_64 □ arm64（默认 **arm64**） |
| 15 | **禁止清单确认** | 勾选：□ **不**在边缘 handler 内用无界 `while(true)` 烧 CPU；□ **不**把长任务伪造成「无限墙钟」；□ **不**双平台双默认；□ 密钥不进源码/CI 日志 |
| 16 | **鉴权** | 受保护路径：□ 无（公开）□ Bearer/JWT（对齐 [auth](../auth/README.md)）□ 平台 Access / 签名校验 — 择一 |

## 平台裁剪

| 平台 | 必读章 | 可 N/A |
|------|--------|--------|
| Cloudflare Workers（默认） | 03（Workers）、04–08 | 03 OpenNext/Lambda 细项 |
| OpenNext / Vercel Functions | 03（OpenNext）、04–08 | 03 Workers 绑定 DDL；仍须理解 Lifecycle |
| AWS Lambda | 03（Lambda）、04–08 | 03 Workers 绑定；Lifecycle 步骤仍适用 |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
