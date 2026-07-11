# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（Workers 默认；其它平台词根不变）
src/
 index.ts # 唯一 fetch 入口（挂 Hono）
 app.ts # 路由组装（可选）
 features/<capability>/ # 业务能力：例 checkout/、notify/
 <action>/ # 例 create-order/ — 与路由同词根
 route.ts # HTTP 处理（校验→用例→响应）
 <action>.ts # 纯领域/用例（可测；禁 *Manager）
 shared/
 http/ # 错误映射、幂等头解析（基础设施名允许）
 env.ts # 读绑定/环境；启动校验
wrangler.toml # 或 wrangler.jsonc — 平台配置 SSOT（Workers）
ops/
 functions.md # 可选：触发面/超时说明（非第三方 APM 必勾）
tests/
 invocation/ # Lifecycle 探针
```

OpenNext：`app/api/<capability>/<action>/route.ts` — **能力词根同 Pass1**；禁 `app/api/handler1`。 
Lambda：`functions/<capability>/<action>/handler.ts` — 同上。

依赖方向：`features/<业务> → shared/http → 平台 runtime`；**禁**在业务文件散落第二套超时/重试数字（须读 INPUTS / env）。

UI 状态矩阵：本品类默认 **N/A**（基础设施/API）；若产品暴露「调用状态」页，状态名必须用 Pass1 词表。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **路由、能力、触发、错误码** = 业务能力/操作词根（`checkout.create`、`notify.send`），禁 `fn1`、`doStuff`、`processRequest`。 
3. **禁**技术翻译名进领域模块主名：`*Dto`、`*Manager`、`*Service`、`*HandlerHelper`、`handle*`、`process*`、`do*`（词表未收录则禁）。基础设施可用 `WorkerEntrypoint` / `createApp` 例外（见 meta）。 
4. **禁**同义词分叉：`invoke`/`call`/`run` 词表只留一个（本册默认 **`invoke`** 指一次 Invocation）；成功出口 **`response`**；失败超时 **`timeout`**；再执行 **`retry`**。冷启动 **`cold`** / 热 **`warm`** 仅描述实例状态，不作业务能力名。 
5. 对外协议字段名（JSON / header）冻结在词表。

| 概念 | 正例 | 反例 |
|------|------|------|
| 能力路径 | `/checkout/create`、`notify.send` | `/api/fn1`、`/process` |
| 操作 | `invoke`、`respond`、`timeout`、`retry` | `handleRequest`、`doWork`、`processEvent` |
| 幂等键 | `order:{id}:create` | 无业务维度的裸 UUID 当唯一策略 |
| 错误码 | `VALIDATION`、`TIMEOUT` | `err2`、`FAIL_FLAG` |
| 绑定名 | `ORDERS_DB`、`RECEIPTS_BUCKET` | `KV1`、`myBinding` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 路由 path | `kebab-case` 分段；全文一种 |
| TS 导出 | `camelCase` 函数；类型 `PascalCase` |
| 环境变量 | `SCREAMING_SNAKE`；成对名 staging/prod 相同 |
| Workers 绑定 | `SCREAMING_SNAKE` 与 wrangler 一致 |
| Cron 名 | 业务词根 + `.cron` 后缀进词表（例 `digest.daily.cron`） |
| 包脚本 | 见 [commands.md](./commands.md) / `templates/package-scripts.snippet.json` |
