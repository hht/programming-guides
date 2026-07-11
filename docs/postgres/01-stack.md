# 01 — 栈

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
# 3) atlas migrate hash
# 4) atlas migrate apply --dir file://db/migrations --url "${DATABASE_URL_MIGRATE:-$DATABASE_URL}"
# RLS 时必须用 owner 的 DATABASE_URL_MIGRATE（见 INPUTS §5b / commands）
# （若用 atlas.hcl 约定 env，须与 INPUTS §13 同路径；禁止无 --dir/无 hcl 的裸 apply）
```

版本：PG 大版本约定 16+；Atlas 取稳定版。迁移目录 SSOT = `db/migrations`（INPUTS §13）。
