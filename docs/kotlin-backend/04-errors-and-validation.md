# 04 — 错误与校验

## 不变量

- 响应 JSON 统一：`{"code":"...","message":"...","fields":{optional}}` 
- `code` ∈ INPUTS 表；HTTP status 由 code 映射（单处 `AppError.httpStatus`） 

## 默认映射

| code | HTTP |
|------|------|
| VALIDATION | 400 |
| UNAUTHORIZED | 401 |
| FORBIDDEN | 403 |
| NOT_FOUND | 404 |
| CONFLICT | 409 |
| INTERNAL | 500 |

## 步骤规格

1. 解码：`call.receive<T>()` + kotlinx.serialization；**未知字段禁止忽略**——`Json { ignoreUnknownKeys = false }`。畸形 JSON → **`VALIDATION` 400**。 
2. 校验：手写小函数 + 表驱动（默认）；若引入校验库须全仓统一。失败 → `AppError(VALIDATION, fields=...)`。 
3. `fields`：字段 path → 人类可读或 message key（与前端约定）。 
4. **StatusPages**：捕获 `AppError` → 按 code 写 JSON；捕获未包装 `Throwable`（**除**须 re-throw 的 `CancellationException`）→ `INTERNAL`；`message` 固定 **`internal error`**；logger 记完整异常。 
5. 禁止把 `SerializationException` 原文、SQLException message 回客户端。 

## 单测探针

| case | 期望 |
|------|------|
| 缺必填字段 | 400 + code=VALIDATION + fields |
| 未知 JSON 字段 | 400 VALIDATION |
| 未包装异常 | body 无 stack / 驱动字符串；message=`internal error` |
