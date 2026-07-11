# 来源、标杆与差距表

## 证据等级

P0 > P1 > P1w > E。冲突时先进优先（元指南 §3.4）。

## P0

| 主题 | URL |
|------|-----|
| Ktor | https://ktor.io/docs/ |
| kotlinx.serialization | https://github.com/Kotlin/kotlinx.serialization |
| Exposed | https://github.com/JetBrains/Exposed |
| Kotlin coroutines | https://kotlinlang.org/docs/coroutines-guide.html |
| Flyway | https://documentation.red-gate.com/flyway |
| detekt | https://detekt.dev/ |
| Gradle Kotlin DSL | https://docs.gradle.org/current/userguide/kotlin_dsl.html |

## 标杆 \(B\)（3 开源 HTTP API）

| ID | 仓库 | 品类匹配 | 学什么 | 不学什么 |
|----|------|----------|--------|----------|
| A | [Rudge/kotlin-ktor-realworld-example-app](https://github.com/Rudge/kotlin-ktor-realworld-example-app) | Kotlin RealWorld HTTP JSON API（Ktor + Exposed） | 路由/用例分层、鉴权面、错误形状、可测布局 | 整仓抄 RealWorld 业务域；Kodein 全家桶 |
| B | [raharrison/kotlin-ktor-exposed-starter](https://github.com/raharrison/kotlin-ktor-exposed-starter) | Ktor + Exposed + Flyway 起步服务 | 目录分层、Exposed/Hikari 接线、Flyway、配置 | 过时依赖版本；WebSocket 通知当默认必做 |
| C | [nomisRev/ktor-arrow-example](https://github.com/nomisRev/ktor-arrow-example) | Ktor RealWorld 工程示例（kotlinx.serialization） | 错误处理、模块边界、可测布局、配置分离 | 照搬 Arrow / SqlDelight 为默认（本指南约定 Exposed + `AppError`） |

P0 学习（非 B 共有切条）：**Ktor 文档**、**Exposed**、**coroutines** — 插件管道 / 事务 / suspend 边界对照，不替代上表三仓。

## 能力切条 → 共有

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| HTTP JSON API | ✓ | ✓ | ✓ | 必做 |
| 鉴权或明确无鉴权 | ✓ | ✓ | ✓ | 必做 |
| 持久化 + 迁移 | ✓ | ✓ | ✓ | 必做 |
| 结构化错误响应 | ✓ | ✓ | ✓ | 必做 |
| 配置/环境分离 | ✓ | ✓ | ✓ | 必做 |

> **共有** = 用户可感知能力在 \(B\) 的 ≥2 证据源出现（与 [../go/](../go/sources.md) / [../fastapi/](../fastapi/sources.md) 同构切条；上表与 `11` §B 同构）。**可测布局**（`Application.module` / test host）与 **`/healthz`+`/readyz` 探针**属工程面（后者为指南硬约定，非共有用户可感知切条）→ 见差距表；实现仍见 `01`/`03`/`09`。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做/可选/参考 |
|------|------|------|------|----------------|
| Ktor 插件管道 + Netty | P0 Ktor | 工程 | `03` | 必做 |
| kotlinx.serialization | P0（先进于 Jackson 默认） | 工程 | `04`/`05` | 必做 |
| Exposed + Flyway | P0（先进于 JPA 默认） | 工程 | `06` | 必做 |
| 可测布局（`module()` / test host） | A,C | 工程 | `01`/`09` | 必做（工程；**非共有**） |
| `/healthz`+`/readyz` 探针 | 工程（指南硬约定） | 工程 | `03`/`09` | 必做（工程；**非共有**） |
| Request ID + MDC | E 强化 | 工程 | `05` | 必做（超越） |
| 多语句写显式事务 | E | 功能 | `05` | 必做（超越） |
| detekt + ktlint | P0 | 工程 | `08` | 必做 |
| OTel/Sentry | — | 参考 | `08` | 参考 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| Spring Boot 更「企业流行」 | **采用 Ktor**（协程一等、轻、插件边界清晰；先进优先；Spring 不进默认；若产品强制 Spring → 另册） |
| Hibernate/JPA 更流行 | **采用 Exposed**（Kotlin DSL + 显式事务；与 Ktor suspend 同构） |
| jdbi ≈ sqlc、SQL-first 更「纯」 | **采用 Exposed**（本册先进默认；jdbi 不进默认，勿双栈） |
| Jackson 仍为 JVM JSON 默认 | **采用 kotlinx.serialization**（与 Kotlin 类型系统同构） |
| Arrow / 函数式错误轨道（C） | **不指定 Arrow**（C 学边界；默认 `AppError` + StatusPages） |
| SqlDelight（C）vs Exposed | **采用 Exposed**（与 B/A 可映射；禁默装第二套 ORM） |
