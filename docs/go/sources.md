# 来源、标杆与差距表

## 证据等级

P0 > P1 > P1w > E。冲突时先进优先（元指南 §3.4）。

## P0

| 主题 | URL |
|------|-----|
| Effective Go | https://go.dev/doc/effective_go |
| net/http | https://pkg.go.dev/net/http |
| log/slog | https://pkg.go.dev/log/slog |
| chi | https://github.com/go-chi/chi |
| pgx | https://github.com/jackc/pgx |
| sqlc | https://docs.sqlc.dev/ |
| golang-migrate | https://github.com/golang-migrate/migrate |
| context | https://pkg.go.dev/context |

## 标杆 \(B\)（3 开源）

| ID | 仓库 | 品类匹配 | 学什么 | 不学什么 |
|----|------|----------|--------|----------|
| A | [pocketbase/pocketbase](https://github.com/pocketbase/pocketbase) | Go 单体 HTTP 后端 API | 路由组织、鉴权面、单二进制交付 | 整仓抄 PocketBase 运行时 |
| B | [supabase/auth](https://github.com/supabase/auth) | 生产级 Go JWT/用户 API | 鉴权端点、错误语义、配置 | 照搬 Supabase 云产品细节 |
| C | [knadh/listmonk](https://github.com/knadh/listmonk) | Go HTTP API + 管理面 | 配置、迁移、handler 分层 | 邮件业务域 |

## 能力切条 → 共有

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| HTTP JSON API | ✓ | ✓ | ✓ | 必做 |
| 鉴权或明确无鉴权 | ✓ | ✓ | ✓ | 必做 |
| 持久化 + 迁移 | ✓ | ✓ | ✓ | 必做 |
| 结构化错误响应 | ✓ | ✓ | ✓ | 必做 |
| 配置/环境分离 | ✓ | ✓ | ✓ | 必做 |
| 健康检查 | ✓ | ✓ | ✓ | 必做 |

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做/可选/参考 |
|------|------|------|------|----------------|
| net/http 兼容中间件 | P0 chi | 工程 | `03` | 必做 |
| sqlc 类型安全 SQL | P0（先进于 ORM） | 工程 | `06` | 必做 |
| slog 结构化日志 | P0 stdlib | 工程 | `03`/`08` | 必做 |
| 优雅关闭 + 超时 | 生产共识 | 工程 | `03` | 必做 |
| 写路径事务边界 | E 强化 | 功能 | `05` | 必做（超越） |
| 请求 ID 贯穿日志 | E | 工程 | `05` | 必做（超越） |
| OTel/Sentry | — | 参考 | `08` | 参考 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Gin/Echo 更「全家桶」流行 | **采用 chi**（stdlib `http.Handler` 兼容，先进边界清晰） |
| GORM 更流行 | **采用 sqlc+pgx**（SQL 与类型显式，先进优先） |
| zap 仍流行 | **采用 log/slog**（stdlib；禁无理由再引 zap） |
