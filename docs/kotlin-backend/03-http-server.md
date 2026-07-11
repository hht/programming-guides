# 03 — HTTP Server

## 不变量

- 单一 `Application.module()`（或 `createApplication`）安装插件与路由；测试与生产共用 
- 引擎：**Netty**；`embeddedServer` / `EngineMain` 均可，超时与端口来自 settings 
- 优雅退出：收到 SIGINT/SIGTERM → `server.stop(gracePeriodMillis, timeoutMillis)`；连接池 `close` 

## 默认超时 / 限制（可改但须单处常量）

| 项 | 默认 |
|----|------|
| 请求 body | **1 MiB**（`call.receive` 前/配置 `maxContentLength`） |
| 连接建立 / idle（Netty） | idle **60s**（与引擎配置对齐，单处约定） |
| 请求处理预算 | 写超时语义由路由+DB 超时保证；出站 HTTP 默认 **10s** |
| Shutdown grace | **10s** |
| Hikari `maximumPoolSize` | **10** |

## 步骤规格

1. `main`：load settings（fail-fast）→ Logback → `Database.connect` + **Flyway migrate**（**默认启动时 migrate**；与 go 册同文）→ `embeddedServer(Netty, host/port) { module() }.start(wait = true)`。 
2. 插件顺序：`CallId`/`RequestId`（见 `05`）→ **StatusPages**（见 `04`）→ ContentNegotiation(json) → CallLogging（带 `request_id`）→ **Auth（仅受保护 route）** → Routing。 
3. 路由：`GET /healthz`（liveness 200）；`GET /readyz`（Exposed/`SELECT 1` ping，失败 **503**）；业务挂 `/v1/...`。 
4. CORS：仅当浏览器跨域需要时按 INPUTS §12 origin 白名单；默认同站不开 `*`。 
5. OpenAPI：契约以仓根 `openapi.yaml` 为 SSOT；Ktor 可选生成，**禁止**与 yaml 漂移（CI 可 diff）。 

## 失败分类

| 情况 | 行为 |
|------|------|
| 配置缺必填 | 启动异常；exit ≠0 |
| 监听失败 | 日志 + exit 1 |
| Shutdown 超时 | 日志错误；exit 1 |
| ready 查库失败 | 503 |

## 单测探针

| case | 期望 |
|------|------|
| /healthz | 200 |
| 未注册方法 | 405 |
