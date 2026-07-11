# 05 — Request Lifecycle（核心正确性路径）

## 不变量

全文唯一主路径：`接入 → 中间件 → 解码+校验 → 用例 → 持久化 → 响应`。

超越：

1. `对照：B 中更弱/未见「每个请求强制 X-Request-ID（或生成）并写入 slog 与响应头」硬门闸 → 本指南要求` 
2. `对照：B 中更弱/未见「多语句写必须显式事务」硬门闸 → 本指南要求；单语句可无显式 Begin`

## 步骤规格

1. **RequestID 中间件**：读 `X-Request-ID`；空则生成 UUIDv4（`github.com/google/uuid`）；写入 ctx（key 类型写明：`type ctxKey string`；常量 `ctxKeyRequestID ctxKey = "request_id"`）+ 响应头 + slog 属性 `request_id`。 
2. 中间件顺序：`RequestID` → `RealIP`（`chi/middleware.RealIP`；默认信任 `X-Forwarded-For` 最左；无代理则用 `RemoteAddr`）→ **Recoverer**（panic → `slog.Error` + `apierrors.Write` 写 **`INTERNAL`** JSON，**禁止** chi 默认明文 500）→ `slog` 访问日志 → **Auth（仅受保护 Group）** → handler。 
3. **Handler 内顺序**： 
 - `http.MaxBytesReader(w, r.Body, 1<<20)`（**1 MiB**；超限 → `VALIDATION`） 
 - **Decode+validate** 
 - 若该写操作要幂等：读 **`Idempotency-Key`**（缺 → `VALIDATION`）；传入 service 
 - 调 service → **写出**（见下） 
4. **Service 返回契约**： 
 - **幂等写**：返回 `(status int, body []byte, err)`；`body` 为 **已 JSON marshal 一次** 的字节；成功路径在 Tx 内 `INSERT` 同 status/body 后 Commit；handler **禁止再 marshal**，只 `WriteHeader(status)` + `Write(body)` + `Content-Type: application/json`。回放同。 
 - **非幂等**：返回 DTO/`*apierrors.Error`；handler `json.NewEncoder` 编码一次。 
5. **Service（幂等=要时）**：`Begin` → `SELECT`；未过期命中 → `Rollback` + 返回存贮 status/body；过期 → 同 Tx `DELETE` 当未命中；未命中 → 业务写 → marshal body → `INSERT` → `Commit`。业务失败 → `Rollback`（无幂等行）。并发 `23505` → `Rollback` → **新 `Begin` 再 SELECT**，最多 **3** 次（间隔 50ms）；命中走回放；仍无 → `CONFLICT`。此路径 **不** 经 `From(23505)`。TTL 默认 **24h**。 
6. **Service 错误 / `apierrors.From`（唯一映射入口）**： 
 | 条件 | code | 
 |------|------| 
 | `errors.Is(err, pgx.ErrNoRows)` 或 sqlc 空行等价 | NOT_FOUND | 
 | Postgres unique_violation `23505`（非幂等回放路径） | CONFLICT | 
 | 已是 `*apierrors.Error` | 原样 | 
 | 其它 | INTERNAL | 
 handler：`ctx.Err()!=nil` 则不 `Write`，否则 `apierrors.Write`。 
7. **无幂等事务**：多表或多语句 → service `Begin`；handler 永不 `Begin`。 
8. **INTERNAL message**：`internal error`。 
9. **ctxKeySubject** = `"subject"`。 
10. **幂等范围**：INPUTS §3 主写 + OpenAPI 标注要 key 的写。 
11. **Idempotency-Key**：非空；长度 **1–128** 可打印 ASCII；超限 → `VALIDATION`。 

## 失败分类

| 情况 | code |
|------|------|
| 校验失败 / body 超限 / 缺 Idempotency-Key（若要求） | VALIDATION |
| 未登录 | UNAUTHORIZED |
| 资源不存在 | NOT_FOUND |
| 唯一约束冲突（非幂等键回放路径） | CONFLICT |
| ctx 取消/超时 | **不写**响应 |
| 其它 | INTERNAL |

## 单测探针

| case | 期望 |
|------|------|
| 无 X-Request-ID | 响应带生成的 ID；日志含同 ID |
| body > 1 MiB | 400 VALIDATION；不调 service |
| 校验失败 | 不调 service（mock） |
| 服务返回领域 NOT_FOUND | 404 JSON |
| 多写中途失败 | 无部分提交（集成测） |
| 同 Idempotency-Key 重放（若启用） | status+body 字节与首次一致（handler 未二次 marshal） |
| Recoverer panic | 500 + code=INTERNAL + message=internal error |
