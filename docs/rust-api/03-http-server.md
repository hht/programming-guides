# 03 — HTTP Server

## 不变量

- 自建 `axum::Router`；**禁止**把业务路由挂到未封装的全局静态 mux  
- 必须设：**请求体上限**（见 `05`）、**connect/读侧超时**（`tower_http` / `TimeoutLayer` 或 hyper server builder）、**优雅退出** deadline  
- 优雅退出：`SIGINT`/`SIGTERM` → `axum::serve` + `with_graceful_shutdown`（或等价），shutdown deadline 默认 **10s**

## 默认超时（可改但须单处常量）

| 项 | 默认 |
|----|------|
| Request body limit | **1 MiB**（与 `05` 同文） |
| 单请求超时（TimeoutLayer） | 30s |
| Shutdown | 10s |
| Listen | `HTTP_ADDR`（例 `:8080`） |

> 说明：Go 册拆 ReadHeader/Read/Write/Idle；本栈以 **TimeoutLayer + body limit + graceful shutdown** 钉死等价预算。若换 hyper 低层 builder，须在单处常量映射同等语义。

## 步骤规格

1. `main`：load config → `sqlx::PgPool` → migrate up（或独立 job；产品钉一种，**默认启动时 migrate up**）→ `server::router` → `TcpListener::bind` → serve + graceful shutdown。  
2. 中间件顺序（钉死）：`RequestId` → **CatchPanic / 错误映射（panic→INTERNAL JSON，见 05）** → `tracing` 访问日志（tower-http TraceLayer 或自写）；**Auth 只挂在受保护 `Router` nest/merge**（见 `05`/`07`）。  
3. 路由：`GET /healthz`（liveness）、`GET /readyz`（`Pool::acquire` + `SELECT 1`）；业务挂 `/v1/...`。  
4. CORS：仅当浏览器跨域需要时按 INPUTS §12 origin 白名单；默认同站不开 `*`。  

## 失败分类

| 情况 | 行为 |
|------|------|
| 监听失败 | 日志 + exit 1 |
| Shutdown 超时 | 日志错误；exit 1 |
| migrate 失败 | 日志 + exit 1 |

## 单测探针

| case | 期望 |
|------|------|
| /healthz | 200 |
| 未注册方法 | 405 |
