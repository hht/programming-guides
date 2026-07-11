# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `migrate-up` | `sqlx migrate run` | 本地/发版 | 0 |
| `sqlx-prepare` | `cargo sqlx prepare` | 改查询后 | 0；更新 `.sqlx/` |
| `test` | `SQLX_OFFLINE=true cargo test` | PR | 0 |
| `fmt` | `cargo fmt --check` | PR | 0 |
| `lint` | `cargo clippy -- -D warnings` | PR | 0 |
| `check` | `cargo fmt --check && cargo clippy -- -D warnings && SQLX_OFFLINE=true cargo test` | PR | 0 |
| `test-integration` | `docker compose -f docker-compose.test.yml up -d --wait && sqlx migrate run && cargo test --test integration -- --nocapture && docker compose -f docker-compose.test.yml down`（`DATABASE_URL=postgres://app:app@localhost:5432/app_test?sslmode=disable` 与 compose 例同文；矩阵见 `09`；若仓用 `--features integration` 则命令字符串与 Makefile 同改） | 发版 | 0 |
| `build` | `SQLX_OFFLINE=true cargo build --release` | 发版 | 0 |

`fmt` / `lint` 与 [rust Language Gate](../meta/language-gates/rust.md) **逐字一致**（`check` 内为同一子串）。
