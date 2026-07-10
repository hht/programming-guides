# 03 — HTTP Server

## 不变量

- 单一 `create_app() -> FastAPI`；测试与 uvicorn 共用模块级 `app`  
- lifespan：创建 engine → yield → dispose engine；**禁止** lifespan 内 migrate  
- 优雅退出：lifespan 关闭连接池  

## 默认超时 / 限制

| 项 | 默认 |
|----|------|
| 请求 body | **1 MiB** |
| DB `pool_size` | 5 |
| DB `max_overflow` | 10 |
| 出站 httpx timeout | 10s |

## 步骤规格

1. `main`：load settings → structlog → `create_app`；`app = create_app()`；uvicorn `app.main:app`。  
2. 中间件：**BodyLimit**（Starlette 中间件：若 `Content-Length > 1 MiB` 或实读超过 1 MiB → raise `AppError(VALIDATION)` / 由 handler 变 422）→ `RequestID` → CORS（仅 §12）。  
3. 路由：`GET /healthz` → 200 `{"status":"ok"}`；`GET /readyz` → `SELECT 1`，失败 503。业务 `/v1/...`。  
4. OpenAPI：非 prod 开 `/docs`；prod 关闭。  
5. `HTTP_ADDR` → uvicorn host/port；缺省 `0.0.0.0:8000`。  

## 失败分类

| 情况 | 行为 |
|------|------|
| 配置校验失败 | 启动异常；exit ≠0 |
| ready 查库失败 | 503 |

## 单测探针

| case | 期望 |
|------|------|
| /healthz | 200 |
| 未注册方法 | 405 |
