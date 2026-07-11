# 00 — 原则与不变量

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 硬不变量

1. **Handler 薄**：`http.Handler` 只做解码/编码/status；业务在 `internal/<bc>/` 用例，可单测。 
2. **context 贯穿**：下游 DB/HTTP 出站必须接 `ctx`；禁止裸 `context.Background()` 在请求路径（除 main 启动）。 
3. **错误分类**：领域错误 → 稳定 `code` + HTTP status；未知 → `INTERNAL` + 日志，**禁止**把内部 err 字符串直接回客户端。 
4. **SQL 只经 sqlc 生成代码**（+ migrate SQL）；禁止在 handler 拼业务 SQL 字符串。 
5. **写路径事务**：跨**多表或多语句**写必须显式事务；单语句可无 Begin。 
6. **配置 fail-fast**：缺必填 env → `main` 非 0 退出。 
7. **deletion-first**；无 INPUTS 的端点不做。

## SSOT

| 真相 | Owner |
|------|--------|
| 路由 | `internal/server/routes.go`（或等价单处） |
| OpenAPI / 端点契约 | INPUTS → 仓内 **`openapi.yaml`**（唯一） |
| SQL schema | `migrations/` |
| 查询 | `sql/queries/*.sql` → `internal/db`（sqlc 生成，禁手改） |
| 配置 | `internal/config` |
| 错误码 | `internal/apierrors` |
| 日志 | `log/slog`（JSON handler 生产） |

## 超越对照

1. `对照：B 中更弱/未见「请求路径强制 request_id 写入 slog 与响应头」硬门闸 → 本指南要求` 
2. `对照：B 中更弱/未见「多表写必须显式事务否则禁止合并提交」硬门闸 → 本指南要求`
