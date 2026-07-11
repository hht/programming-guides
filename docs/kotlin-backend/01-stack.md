# 01 — 默认栈

## 栈表

| 层 | 选择 | 备注 |
|----|------|------|
| 语言 | **Kotlin ≥2.0** | `jvmToolchain(21)`（或 17；CI 同主版本）；`kotlin("jvm")` |
| 构建 | **Gradle Kotlin DSL** + **version catalog**（`gradle/libs.versions.toml`） | 提交 `gradle.lockfile`（或等价依赖锁定） |
| Web | **io.ktor:ktor-server-***（**Netty**） | `ktor-server-core` / `netty` / `content-negotiation` / `status-pages` / `call-id` / `call-logging` / `auth`（按需） |
| 序列化 | **kotlinx.serialization** JSON | ContentNegotiation `json()`；**禁止**默认 Jackson |
| DB DSL | **org.jetbrains.exposed** | `exposed-core` + `exposed-jdbc` + `exposed-java-time`；协程用 `newSuspendedTransaction` |
| 驱动 | **org.postgresql:postgresql** | Postgres JDBC |
| 池 | **HikariCP** | 经 Exposed `Database.connect` |
| 迁移 | **Flyway** | `db/migration/`；`V{n}__{name}.sql` |
| 日志 | **SLF4J** + **Logback** | 生产 JSON；MDC 绑 `request_id` |
| 测试 | **JUnit 5** + **ktor-server-test-host** | |
| Lint/格式 | **detekt** + **ktlint** | 命令 SSOT → [kotlin Language Gate](../meta/language-gates/kotlin.md) |
| JWT（仅 Bearer） | **com.auth0:java-jwt** | 无鉴权/Session 不引入 |
| 密码（仅 Session） | **at.favre.lib:bcrypt**（或 argon2-jvm） | 默认 **bcrypt**；与 INPUTS 表一致 |
| UUID | `java.util.UUID` | RequestID |

**禁止开口**：Spring Boot / WebFlux 任选、Jackson 默认、Hibernate/JPA 默认、jdbi 默认、ktor CIO 作默认引擎（生产约定 Netty）、无理由第二套 lint。  
语言硬门闸：[kotlin.md](../meta/language-gates/kotlin.md)（**不**在本文件复述）。

## 冲突裁决（先进优先）

| 冲突 | 裁决 |
|------|------|
| **Spring Boot 更「企业流行」** | **采用 Ktor**（协程一等、插件边界清晰、轻；Spring **不进**默认；若产品强制 Spring → **另册**，勿改本栈表） |
| Hibernate/JPA 更流行 | **采用 Exposed**（Kotlin DSL + 显式事务；与 Ktor suspend 同构） |
| jdbi 更接近 sqlc / SQL-first | **采用 Exposed**（本册先进默认；jdbi 不进默认，勿双栈） |
| Jackson 仍为 JVM 默认 | **采用 kotlinx.serialization**（与 Kotlin 类型系统同构；禁默装 Jackson） |
| Micronaut / http4k 亦先进 | **采用 Ktor**（本指南品类单默认；禁开口） |

## 脚手架

```bash
mkdir <name> && cd <name>
# 用 Gradle 建 Kotlin JVM 应用（Kotlin DSL + version catalog）
gradle init --type kotlin-application --dsl kotlin --java-version 21 --package <package>
# 或等价：手写 settings.gradle.kts / build.gradle.kts / gradle/libs.versions.toml

# 依赖（经 catalog 约定版本；键名见 templates/gradle-libs.versions.toml.example）：
# ktor-server-netty, ktor-server-content-negotiation, ktor-serialization-kotlinx-json
# ktor-server-status-pages, ktor-server-call-id, ktor-server-call-logging, ktor-server-auth（按需）
# exposed-core, exposed-jdbc, exposed-java-time, postgresql, HikariCP, flyway-core
# slf4j-api, logback-classic, logstash-logback-encoder（或等价 JSON encoder）
# 测试：ktor-server-test-host, junit-jupiter
# 工具：detekt, ktlint
# 若 INPUTS 选 Bearer JWT：java-jwt
# 若 Session：bcrypt（或 argon2）
```

`build.gradle.kts` 须含：

- `plugins`：`kotlin("jvm")`、`kotlin("plugin.serialization")`、`application`、detekt、ktlint 
- `application { mainClass.set("<package>.ApplicationKt") }`（或等价入口） 
- 测试：`useJUnitPlatform()` 

入口：`fun main()` → `embeddedServer(Netty, ...)` 或 `EngineMain`；**可测路径**必须抽出 `fun Application.module()`（或 `createApplication(): Application`）供 test host 安装。

## 锁版本

提交 Gradle Wrapper + version catalog + 依赖锁；升级走 PR + `./gradlew test`。
