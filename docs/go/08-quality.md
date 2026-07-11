# 08 — 质量

## 必做

- `golangci-lint run` 
- `go test ./...` 
- `go vet ./...`（可含在 lint） 
- 生产：slog JSON；`APP_ENV=prod` 时禁 debug 默认级 

## 宜做 / 参考

| 项 | 要求 |
|----|------|
| race | `go test -race` 宜做；本指南默认裁剪：理由=HTTP API 发版以 `test-integration` 矩阵为准，race 不进必勾 |
| OTel/Sentry | **仅参考**，不进必勾 |
| pprof | 仅非 prod 或受控端口 |

## 单测探针

| case | 期望 |
|------|------|
| lint | CI exit 0 |
