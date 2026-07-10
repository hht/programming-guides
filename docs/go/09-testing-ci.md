# 09 — 测试与 CI

## 单测

包内 `*_test.go`（集成测放 `*_integration_test.go` + `//go:build integration`）。

| case | 期望 |
|------|------|
| 校验 / 未知字段 | VALIDATION |
| RequestID | 头回传 |
| service NOT_FOUND | 映射 404 |
| Auth 中间件 | 401/通过 |
| 错误不泄漏内部 | body 无 sql/驱动字符串；INTERNAL message=`internal error` |

## 发版 e2e / 集成（必做矩阵）

跑法（钉死，与 `commands.md` / `templates/Makefile.snippet` 同文）：

1. 复制 `templates/docker-compose.test.yml.example` → 仓根 `docker-compose.test.yml`  
2. `export DATABASE_URL=postgres://app:app@localhost:5432/app_test?sslmode=disable`（与 compose 例同文）  
3. `docker compose -f docker-compose.test.yml up -d --wait`  
4. `migrate -path migrations -database "$DATABASE_URL" up`  
5. `go test ./... -tags=integration -count=1`（测内用 `httptest.Server` 挂 chi，或起进程；须覆盖矩阵）  
6. `docker compose -f docker-compose.test.yml down`

| # | 场景 | 断言 |
|---|------|------|
| 1 | GET /healthz | 200 |
| 2 | GET /readyz（DB up） | 200 |
| 3 | 主写用例成功（INPUTS §3） | 契约 status + body 字段 |
| 4 | 主写缺字段 | 400 VALIDATION |
| 5 | 受保护路由无票（若有鉴权） | 401 |

## CI

| 触发 | 命令 |
|------|------|
| PR | `make check`（= `sqlc generate` + `go test ./...` + `golangci-lint run`） |
| 发版 | `make check` + `make test-integration`（矩阵 1–5） |
