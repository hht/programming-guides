# 02 — 目录与命名

## 树（钉死）

```text
<repo>/
  go.mod
  go.sum
  cmd/
    api/
      main.go              # 只接线：config、pool、server、信号
  internal/
    config/
    server/                # chi router、middleware、Listen
    apierrors/
    auth/                  # 鉴权中间件与解析
    <bounded-context>/     # 例 users、billing
      handler.go
      service.go           # 用例
      # 无 SQL 字符串
    db/                    # sqlc 生成（禁手改）
  sql/
    queries/               # sqlc 输入
    schema/                # 可选参考
  migrations/              # golang-migrate
  openapi.yaml             # 契约 SSOT 默认文件名（勿并行 docs/api.md）
  sqlc.yaml
  Makefile                 # 目标名见 commands.md（禁止 just 作默认）
```

## 依赖方向

```text
cmd/api → server → <bc>/handler → <bc>/service → db(sqlc) → pgx
                → auth
                → config
```

禁止：`utils/`、`models/`、`common/` 大口袋；`db` 生成包手改；`handler` 直接 `pgxpool` 绕过 service（`/healthz`/`/readyz` 除外）。

## 命名

| 种类 | 规则 |
|------|------|
| 包名 | 短小、无下划线；bc 用复数资源名 `users` |
| migrate 文件 | `{version}_{name}.up.sql` / `.down.sql` |
| sqlc query | `-- name: GetUser :one` |
| 错误码 | `SCREAMING_SNAKE` 与 INPUTS 一致 |
