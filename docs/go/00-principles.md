# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [go Language Gate](../meta/language-gates/go.md)。本文件只含 **Go API 品类 MUST**。

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | `http.Handler` 只做解码/编码/status；业务在 `internal/<bc>/` | 单测 |
| F02 | MUST | 下游 DB/HTTP 出站接 `ctx` | 代码抽检 |
| F03 | MUST NOT | 在请求路径使用裸 `context.Background()`（除 main 启动） | 同上 |
| F04 | MUST | 领域错误 → 稳定 `code` + HTTP status；未知 → `INTERNAL` + 日志 | `09` |
| F05 | MUST NOT | 把内部 err 字符串直接回客户端 | 同上 |
| F06 | MUST | SQL 只经 sqlc 生成代码（+ migrate SQL） | handler 无业务 SQL 字符串 |
| F07 | MUST | 跨多表或多语句写必须显式事务 | 单测 |
| F08 | MUST | 缺必填 env → `main` 非 0 退出 | 启动探针 |
| F09 | MUST | deletion-first；无 INPUTS 的端点不做 | INPUTS |

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
