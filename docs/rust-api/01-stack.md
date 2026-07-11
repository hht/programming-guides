# 01 — 默认栈

## 栈表

| 层 | 选择 | 备注 |
|----|------|------|
| 语言 | **Rust ≥1.83** | `rust-version` 写明；CI 用同主版本；`edition = "2021"`（或仓内统一 2024，须与 CI 一致） |
| 构建 | **Cargo** | `Cargo.lock` **提交**（二进制应用） |
| 运行时 | **tokio** | `features = ["rt-multi-thread", "macros", "signal", "net", "time"]` |
| 路由 / HTTP | **axum** | 最新稳定；底层 tower / hyper |
| 中间件 | **tower** + **tower-http** | TraceLayer、CorsLayer、RequestBodyLimit、SetRequestId 等 |
| DB | **sqlx** | `features = ["runtime-tokio", "postgres", "migrate", "macros", "uuid", "chrono", "json"]` |
| 迁移 | **sqlx migrate** | 文件在 `migrations/`；CLI 或 `sqlx::migrate!` |
| 序列化 | **serde** + **serde_json** | |
| 日志 | **tracing** + **tracing-subscriber** | 生产 JSON；`EnvFilter` |
| 测试 | **cargo test** + **axum::Router` 挂 `oneshot` / `tower::ServiceExt`** | 集成测见 `09` |
| Lint / 格式 | **clippy** + **rustfmt** | 命令 SSOT → [rust Language Gate](../meta/language-gates/rust.md) |
| JWT（仅 Bearer） | **jsonwebtoken** | 无鉴权/Session 不引入 |
| UUID | **uuid**（`v4`） | RequestID |
| 错误类型 | **thiserror**（领域） | `anyhow` 仅 `main` 接线可选；禁泄漏到 JSON body |

**禁止开口**：Actix / Axum 任选、Diesel / SeaORM / sqlx 任选、warp / rocket 默认、`println!` 当生产日志、JWT 库任选。  
语言硬门闸：[rust.md](../meta/language-gates/rust.md)（**不**在本文件复述）。

## 脚手架

```bash
cargo new <name> --bin
cd <name>
# Cargo.toml：rust-version = "1.83"；提交 Cargo.lock
cargo add axum tokio --features tokio/rt-multi-thread,tokio/macros,tokio/signal,tokio/net,tokio/time
cargo add tower tower-http --features tower-http/trace,tower-http/cors,tower-http/limit,tower-http/set-header,tower-http/request-id,tower-http/util
cargo add sqlx --features runtime-tokio,postgres,migrate,macros,uuid,chrono,json
cargo add serde serde_json --features serde/derive
cargo add tracing tracing-subscriber --features tracing-subscriber/env-filter,tracing-subscriber/json
cargo add thiserror uuid --features uuid/v4
cargo add chrono --features serde
# 若 INPUTS 选 Bearer JWT：
cargo add jsonwebtoken
# 开发 / CI 工具：
cargo install sqlx-cli --no-default-features --features rustls,postgres
rustup component add clippy rustfmt
```

`DATABASE_URL` 用于 `sqlx prepare`（离线宏）与 migrate；见 `commands.md`。

## 锁版本

`Cargo.lock` 提交；依赖升级走 PR + `cargo test` + `cargo clippy`。
