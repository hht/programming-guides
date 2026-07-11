# 05 — Request Lifecycle（核心正确性路径）

## 不变量

全文唯一主路径：`接入 → 依赖/中间件 → 解码+校验 → 用例 → 持久化 → 响应`。

超越：

1. `对照：B 中更弱/未见「每个请求强制 X-Request-ID（或缺则生成）写入 structlog 与响应头」硬门闸 → 本指南要求` 
2. `对照：B 中更弱/未见「多表或多语句写必须显式事务」硬门闸 → 本指南要求；单语句可无显式 begin`

## 步骤规格

1. **RequestID 中间件**：读 `X-Request-ID`；空则 `uuid4()`；写入 `request.state.request_id` + 响应头 + structlog contextvars 绑定 `request_id`。 
2. **依赖顺序**：`get_settings` → `get_session`（`AsyncSession`）→（受保护路由）`get_current_subject` → 路由。Auth **在**业务 service 之前。 
3. **路由内顺序**：body 已经 Pydantic；BodyLimit **1 MiB** 强制。 
 - 若 **INPUTS §8=要**：§3 主写及 OpenAPI 标注幂等的写必须读 **`Idempotency-Key`**（缺/非法 → `VALIDATION`） 
 - 若 **§8=不要**：**禁止**实现幂等表/回放；忽略该头 
 然后 `await service...`。 
4. **Service 返回契约**：幂等写返回 `(status, body: bytes)`；存贮与回放用 **同一 UTF-8 文本**（表列 `response_body text`）；handler `Response(...)` 禁止二次序列化。非幂等返回 schema。 
5. **Service（幂等=要）**：使用 **`async with session.begin():`**（退出时自动 commit/rollback，**禁止**在块内再手写 `commit` 与 `begin` 混用）： 
 - 命中未过期：在块内读出后 **`raise` 自定义控制流或提前 return 前确保不写入**——推荐拆成：先 `async with session.begin()` 只读；命中则 return 存贮 body；未命中再开第二个 `async with session.begin()` 做业务+INSERT。 
 - 过期：同事务 DELETE 后当未命中 
 - 并发唯一冲突：捕获后新事务 SELECT 最多 3 次、间隔 50ms；仍无 → `CONFLICT` 
 TTL **24h**。 
6. **`errors.from_exc(err) -> AppError`**：映射后 **raise**（或返回由路由 raise）；`04` 的 `AppError` handler 负责写 JSON。禁止在 `from_exc` 内直接写 Response。 
 | 条件 | code | 
 |------|------| 
 | `NoResultFound` / 领域 not found | NOT_FOUND | 
 | IntegrityError unique / `23505` | CONFLICT | 
 | 已是 `AppError` | 原样 | 
 | 其它 | INTERNAL | 
7. **无幂等写**：多语句 → service `begin/commit`；单语句写末尾 `await session.commit()`。 
8. **INTERNAL message**：`internal error`。 
9. **subject**：`get_current_subject` 写 `request.state.subject`。 
10. **幂等范围**：`key` = SHA-256 hex(`subject\\nmethod\\npath\\nIdempotency-Key`)（无鉴权 subject=`anonymous`）。 
11. **Idempotency-Key**：1–128 可打印 ASCII。 
12. **取消**：`asyncio.CancelledError` **必须 re-raise**；已断开则不写 body、不转 `INTERNAL`。 

## 失败分类

| 情况 | code |
|------|------|
| 校验 / body 超限 / 缺 key | VALIDATION |
| 未登录 | UNAUTHORIZED |
| 不存在 | NOT_FOUND |
| 唯一冲突（非幂等回放） | CONFLICT |
| 取消 | 不写 500 |
| 其它 | INTERNAL |

## 单测探针

| case | 期望 |
|------|------|
| 无 X-Request-ID | 响应带生成 ID；日志含同 ID |
| 校验失败 | 不调 service（mock） |
| NOT_FOUND | 404 JSON |
| 多写中途失败 | 无部分提交（集成） |
| 同 Idempotency-Key 重放 | status+body 字节一致 |
| 未捕获异常 | 500 + internal error |
