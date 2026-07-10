# 03 — HTTP Server

## 不变量

- 自建 `chi.NewRouter()`；**禁止** `http.DefaultServeMux` 挂业务路由  
- `http.Server` 必须设：`ReadHeaderTimeout`、`ReadTimeout`、`WriteTimeout`、`IdleTimeout`（默认见下）  
- 优雅退出：`SIGINT`/`SIGTERM` → `Shutdown(ctx)` 有 deadline  

## 默认超时（可改但须单处常量）

| 项 | 默认 |
|----|------|
| ReadHeaderTimeout | 5s |
| ReadTimeout | 15s |
| WriteTimeout | 30s |
| IdleTimeout | 60s |
| Shutdown | 10s |

## 步骤规格

1. `main`：load config → pgxpool → migrate up（或独立 job；产品钉一种，**默认启动时 migrate up**）→ `server.New` → Listen。  
2. 中间件顺序（钉死）：`RequestID` → `RealIP` → **Recoverer（panic→INTERNAL JSON，见 05）** → `slog` 访问日志；**Auth 只挂在受保护 `r.Group`**（见 `05`/`07`）。  
3. 路由：`GET /healthz`（liveness）、`GET /readyz`（查 DB ping）；业务挂 `/v1/...`。  
4. CORS：仅当浏览器跨域需要时按 INPUTS §12 origin 白名单；默认同站不开 `*`。  

## 失败分类

| 情况 | 行为 |
|------|------|
| 监听失败 | 日志 + exit 1 |
| Shutdown 超时 | 日志错误；exit 1 |

## 单测探针

| case | 期望 |
|------|------|
| /healthz | 200 |
| 未注册方法 | 405 或 chi 默认 |
