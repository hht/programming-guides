# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `sqlc` | `sqlc generate` | 改 SQL 后 | 0 |
| `migrate-up` | `migrate -path migrations -database "$DATABASE_URL" up` | 本地/发版 | 0 |
| `test` | `go test ./...` | PR | 0 |
| `lint` | `golangci-lint run` | PR | 0 |
| `check` | `sqlc generate && go test ./... && golangci-lint run` | PR | 0 |
| `test-integration` | `docker compose -f docker-compose.test.yml up -d --wait && migrate -path migrations -database "$DATABASE_URL" up && go test ./... -tags=integration -count=1 && docker compose -f docker-compose.test.yml down`（`DATABASE_URL=postgres://app:app@localhost:5432/app_test?sslmode=disable` 与 compose 例同文；矩阵见 `09`） | 发版 | 0 |
| `build` | `go build -o bin/api ./cmd/api` | 发版 | 0 |
