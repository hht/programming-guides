# 01 — 默认栈

## 栈表

| 层 | 选择 | 备注 |
|----|------|------|
| 语言 | **Go ≥1.23** | `go.mod` 写明；CI 用同主版本 |
| 模块 | Go modules | |
| 路由 | **github.com/go-chi/chi/v5** | stdlib Handler 兼容 |
| DB 驱动 | **github.com/jackc/pgx/v5** | Postgres |
| 查询 | **sqlc** | 生成到 `internal/db` |
| 迁移 | **github.com/golang-migrate/migrate/v4** | 文件在 `migrations/` |
| 日志 | **log/slog** | 生产 JSON |
| 测试 | **testing** + **testify** | |
| Lint | **golangci-lint** | 配置入库（最小：`linters.enable: [errcheck, govet, staticcheck, unused]`） |
| JWT（仅 Bearer） | **github.com/golang-jwt/jwt/v5** | 无鉴权/Session 不引入 |
| UUID | **github.com/google/uuid** | RequestID |
| 热重载（可选） | air | 不进必做 |

**禁止开口**：Gin/Echo/Fiber 任选、GORM/ent 任选、zap 默认、JWT 库任选。

## 脚手架

```bash
mkdir <name> && cd <name>
go mod init <module-path>
go get github.com/go-chi/chi/v5 github.com/jackc/pgx/v5 github.com/jackc/pgx/v5/pgxpool
go get github.com/golang-migrate/migrate/v4 github.com/golang-migrate/migrate/v4/database/pgx/v5
go get github.com/golang-migrate/migrate/v4/source/file
go get github.com/stretchr/testify github.com/google/uuid
# 若 INPUTS 选 Bearer JWT：
go get github.com/golang-jwt/jwt/v5
# 安装工具（开发机 / CI）：
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
# migrate CLI（与 commands.md 同文）：
go install -tags 'pgx5' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

`sqlc.yaml`：`engine: postgresql`，`sql_package: pgx/v5`。 
`.golangci.yml`：至少启用上表四 lint；可加严不可删默认四项。

## 锁版本

`go.mod` / `go.sum` 提交；依赖升级走 PR + `go test ./...`。
