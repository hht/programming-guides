# 来源、标杆与差距表

## 证据等级

P0 > P1 > P1w > E。冲突时先进优先（元指南 §3.4）。

## P0

| 主题 | URL |
|------|-----|
| The Rust Book | https://doc.rust-lang.org/book/ |
| Tokio | https://tokio.rs/ |
| Tokio tutorial | https://tokio.rs/tokio/tutorial |
| axum | https://docs.rs/axum/latest/axum/ |
| axum examples | https://github.com/tokio-rs/axum/tree/main/examples |
| tower | https://docs.rs/tower/latest/tower/ |
| sqlx | https://docs.rs/sqlx/latest/sqlx/ |
| sqlx migrate | https://github.com/launchbadge/sqlx/tree/main/sqlx-cli |
| tracing | https://docs.rs/tracing/latest/tracing/ |
| API Guidelines | https://rust-lang.github.io/api-guidelines/ |

## 标杆 \(B\)（3 开源 axum 服务）

| ID | 仓库 | 品类匹配 | 学什么 | 不学什么 |
|----|------|----------|--------|----------|
| A | [launchbadge/realworld-axum-sqlx](https://github.com/launchbadge/realworld-axum-sqlx) | Axum + SQLx RealWorld HTTP JSON API | 路由分层、sqlx、鉴权面、错误形状 | 整仓抄 RealWorld 业务域 |
| B | [loco-rs/loco](https://github.com/loco-rs/loco) | Axum 系生产向 Web/API 框架 | 配置、迁移习惯、健康检查、项目骨架 | 照搬 Loco 宏/代码生成全家桶 |
| C | [tranxuanthang/lrclib](https://github.com/tranxuanthang/lrclib) | 真实运行的 Axum HTTP 服务 | 配置/环境分离、持久化、运维向健康面 | 抄歌词业务域与 SQLite 特判 |

P0 学习（非 B 共有切条）：**axum examples**、**tokio** 教程 — 中间件 / 优雅退出 / 异步边界对照，不替代上表三仓。

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
| axum Router + tower 中间件 | P0 axum/tower | 工程 | `03` | 必做 |
| sqlx 类型安全 SQL + migrate | P0（先进于 ORM 默认真相） | 工程 | `06` | 必做 |
| tracing 结构化日志 | P0 | 工程 | `03`/`08` | 必做 |
| 优雅关闭 + 超时/body limit | 生产共识 + P0 tokio/axum | 工程 | `03` | 必做 |
| 写路径事务边界 | E 强化 | 功能 | `05` | 必做（超越） |
| 请求 ID 贯穿日志 | E | 工程 | `05` | 必做（超越） |
| OTel/Sentry | — | 参考 | `08` | 参考 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Actix 下载/历史案例更多，或「Actix 或 Axum 任选」 | **采用 axum**（Tokio 一等、tower 生态、与 P0 examples 同栈）；**禁止**任选开口 |
| Diesel / SeaORM 更「ORM 全家桶」 | **采用 sqlx**（SQL 与类型显式；migrate 同库；先进优先） |
| warp / rocket 仍可见 | **采用 axum**（本指南品类默认；禁平行第二套） |
| `println!` / `log` 箱默认 | **采用 tracing**（async 友好；禁无理由再引第二套日志门面作默认） |
| Loco 一键脚手架 vs 自建分层 | **学 Loco 工程面**；实现按本册 `02` 自建，**禁**双 SSOT 框架 |

## 对抗

| 日期 | ROUND | SCORE | model |
|------|-------|-------|-------|
| 2026-07-11 | gate+framework MUST 重审 | 5/5 | grok-4.5-fast-xhigh |

