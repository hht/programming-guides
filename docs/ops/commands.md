# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | INPUTS §1–8 谓词全过 | exit 0 |
| `check-secrets-names` | `ops/secrets.names.md` 存在；staging/prod 名集合相等；仓内无私钥块 | exit 0 |
| `lint-compose` | `docker compose config` | exit 0 |
| `build` | `docker build -t app:$(git rev-parse --short HEAD) .` | exit 0 |
| `check-actions-sha` | workflows 中 `uses:` 均为 commit SHA（40 hex），无浮动 `@vN` | exit 0 |
| `healthcheck` | 按 healthcheck.steps 对运行中服务 | exit 0 |
| `check-acceptance` | `11` 中 A 必做维与 C1–5、超越 a1/a2/b 均已勾（人工或脚本数 `[x]`） | exit 0 |
| `check` | check-inputs + check-secrets-names + lint-compose + build + check-actions-sha + check-acceptance | exit 0 |
| `release` | 走 `05` 全路径 | 0=`success`；非 0 打印 `MIGRATE_FAILED`/`HEALTH_FAILED`/`ROLLBACK_FAILED`/`ROLLBACK_UNAVAILABLE`/`BUILD_FAILED` 之一 |
| `rollback` | 切 PREV + healthcheck | 0 或 `ROLLBACK_FAILED` |
