# 05 — Request Lifecycle（核心正确性路径）

## 不变量

全文唯一主路径：`接入 → 插件 → 解码+校验 → 用例 → 持久化 → 响应`。

超越：

1. `对照：B 中更弱/未见「每个请求强制 X-Request-ID（或缺则生成）写入日志 MDC 与响应头」硬门闸 → 本指南要求`  
2. `对照：B 中更弱/未见「多表或多语句写必须显式事务」硬门闸 → 本指南要求；单语句可无显式 begin`

## 步骤规格

1. **RequestID 插件**：读 `X-Request-ID`；空则 `UUID.randomUUID()`；写入 `call.attributes[RequestIdKey]` + 响应头 + **SLF4J MDC** 属性 `request_id`。推荐 `CallId` 生成并回写头，再 `MDC.put("request_id", …)`（`finally` 清）。  
2. **插件 / 路由顺序（钉死）**：RequestID/`CallId` → **StatusPages**（见 `04`；未捕获 → `INTERNAL` JSON，**禁止**默认明文 500）→ ContentNegotiation → CallLogging（带 `request_id`）→ **Auth（仅受保护 route）** → handler。Auth **在**业务用例之前。  
3. **Handler 内顺序（钉死）**：  
   - BodyLimit **1 MiB**（超限 → `VALIDATION`；不调用例）  
   - **Decode+validate**（`receive` + 手写校验；未知字段策略见 `04`）  
   - 若 **INPUTS §8=要**：§3 主写及 OpenAPI 标注幂等的写必须读 **`Idempotency-Key`**（缺/非法 → `VALIDATION`）  
   - 若 **§8=不要**：**禁止**实现幂等表/回放；忽略该头  
   - 调用例 → **写出**（见下）  
4. **用例返回契约（钉死）**：  
   - **幂等写**：返回 `(status: Int, body: String)`；`body` 为 **已 JSON encode 一次** 的 UTF-8 文本；成功路径在 Tx 内 `INSERT` 同 status/body 后 commit；路由 **禁止再 encode**，只 `call.respondText(body, ContentType.Application.Json, HttpStatusCode.fromValue(status))`。回放同。  
   - **非幂等**：返回序列化 DTO / 抛 `AppError`；路由 `call.respond(status, dto)`。  
5. **用例（幂等=要）**：`newSuspendedTransaction`（或 `transaction`）：  
   - `SELECT`；未过期命中 → 返回存贮 status/body（不写业务）  
   - 过期 → 同 Tx `DELETE` 当未命中  
   - 未命中 → 业务写 → encode body → `INSERT` → commit  
   - 业务失败 → rollback（无幂等行）  
   - 并发唯一冲突（Postgres `23505`）→ rollback → **新事务再 SELECT**，最多 **3** 次（间隔 50ms）；命中走回放；仍无 → `CONFLICT`。此路径 **不** 经普通 `from(23505)` 映射。TTL 默认 **24h**。  
6. **`AppError.from(exc)`（唯一映射入口）**：映射后 **throw**（由 StatusPages 写 JSON）。禁止在 `from` 内直接 `respond`。  
   | 条件 | code |  
   |------|------|  
   | 领域 not found / Exposed 空结果约定 | NOT_FOUND |  
   | unique_violation `23505`（非幂等回放路径） | CONFLICT |  
   | 已是 `AppError` | 原样 |  
   | 其它 | INTERNAL |  
7. **无幂等写**：多表或多语句 → 用例内显式事务；路由永不开事务。  
8. **INTERNAL message**：`internal error`。  
9. **SubjectKey**：鉴权成功写入 `call.attributes[SubjectKey]`（字符串 subject）。  
10. **幂等范围**：INPUTS §3 主写 + OpenAPI 标注要 key 的写；`key` = SHA-256 hex(`subject\nmethod\npath\nIdempotency-Key`)（无鉴权 subject=`anonymous`）。  
11. **Idempotency-Key**：非空；长度 **1–128** 可打印 ASCII；超限 → `VALIDATION`。  
12. **取消**：`CancellationException` **必须 re-throw**；已取消则不写 body、不转 `INTERNAL`。  

## 失败分类

| 情况 | code |
|------|------|
| 校验 / body 超限 / 缺 Idempotency-Key（若要求） | VALIDATION |
| 未登录 | UNAUTHORIZED |
| 资源不存在 | NOT_FOUND |
| 唯一约束冲突（非幂等键回放路径） | CONFLICT |
| 协程取消 | **不写**响应 |
| 其它 | INTERNAL |

## 单测探针

| case | 期望 |
|------|------|
| 无 X-Request-ID | 响应带生成的 ID；日志/MDC 含同 ID |
| body > 1 MiB | 400 VALIDATION；不调用例 |
| 校验失败 | 不调用例（mock） |
| 用例返回领域 NOT_FOUND | 404 JSON |
| 多写中途失败 | 无部分提交（集成测） |
| 同 Idempotency-Key 重放（若启用） | status+body 字节与首次一致（路由未二次 encode） |
| 未捕获异常 / StatusPages | 500 + code=INTERNAL + message=internal error |
