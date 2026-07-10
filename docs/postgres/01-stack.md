# 01 — 栈（钉死）

| 层 | 选择 |
|----|------|
| 引擎 | **PostgreSQL ≥16**（镜像 `postgres:16`） |
| 迁移 | **Atlas**；目录 `db/migrations` 为 SQL SSOT |
| 本地 | Compose 见 templates |
| 应用客户端 | go→pgx/sqlc；py→SQLAlchemy/asyncpg；ts→Drizzle（各应用册） |

禁止：生产 SQLite；「Flyway 或 Atlas 任选」开口。

## 脚手架

```bash
# 1) compose 起库（复制 templates/compose.db.yaml.example）
# 2) 安装 Atlas CLI（官方当前安装方式）
# 3) atlas migrate hash && atlas migrate apply --url "$DATABASE_URL"
```

版本：PG 大版本钉 16+；Atlas 取稳定版。
