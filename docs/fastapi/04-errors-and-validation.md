# 04 — 错误与校验

## 不变量

- 响应 JSON：`{"code":"...","message":"...","fields":{optional}}` 
- `code` ∈ INPUTS/`04` 表；HTTP status 单处映射 

## 默认映射

| code | HTTP |
|------|------|
| VALIDATION | 422（与 FastAPI/Pydantic 默认对齐；**统一改写**为本文 shape，勿裸 `detail` 数组回客户端） |
| UNAUTHORIZED | 401 |
| FORBIDDEN | 403 |
| NOT_FOUND | 404 |
| CONFLICT | 409 |
| INTERNAL | 500 |

## 步骤规格

1. 请求体：Pydantic 模型；`model_config = ConfigDict(extra="forbid")`（**默认禁未知字段**）。 
2. 注册 `@app.exception_handler(RequestValidationError)` → `VALIDATION` + `fields`（loc→msg）。 
3. 注册领域 `AppError` handler → 按 code 映射。 
4. 注册兜底 `Exception` → `INTERNAL`；`message` 固定 **`internal error`**；structlog 记 `exc_info`。 
5. 畸形 JSON → 同 `VALIDATION`。 

## 单测探针

| case | 期望 |
|------|------|
| 缺必填 | 422 + code=VALIDATION + fields |
| 未知字段 | 422 VALIDATION |
| 未包装异常 | body 无 traceback / 驱动字符串 |
