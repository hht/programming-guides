# 04 — 错误与校验

## 不变量

- 响应 JSON 统一：`{"code":"...","message":"...","fields":{optional}}` 
- `code` ∈ INPUTS 表；HTTP status 由 code 映射（单处 `apierrors.HTTPStatus(code)`） 

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

1. 解码：`json.NewDecoder(r.Body).Decode`；未知字段策略写明：**DisallowUnknownFields**（默认开）。 
2. 校验：手写或 `go-playground/validator` — **默认手写小函数 + 表驱动**；若引入 validator 须全仓统一。畸形 JSON（语法错误）与未知字段一律 **`VALIDATION` 400**。 
3. `fields`：字段 path → 人类可读或 message key（与前端约定）。 
4. `INTERNAL`：`slog.ErrorContext` 记 `err`；响应 `message` 固定 **`internal error`**。 

## 单测探针

| case | 期望 |
|------|------|
| 缺必填字段 | 400 + code=VALIDATION + fields |
| 未知 JSON 字段 | 400 VALIDATION |
| 未包装 err | 不出现在 JSON body |
