# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `test` | `./gradlew test -PexcludeTags=integration`（或等价排除 `@Tag("integration")`） | PR | 0 |
| `fmt` | `./gradlew ktlintCheck` | PR | 0 |
| `lint` | `./gradlew detekt` | PR | 0 |
| `check` | `./gradlew detekt ktlintCheck test -PexcludeTags=integration` | PR | 0 |
| `migrate` | 应用启动 Flyway（默认）或 `./gradlew flywayMigrate`（若引入插件；与 `03`/`06` 同文） | 本地/发版 | 0 |
| `test-integration` | `export DATABASE_URL=jdbc:postgresql://localhost:5432/app_test?user=app&password=app && docker compose -f docker-compose.test.yml up -d --wait && ./gradlew test -PincludeTags=integration && docker compose -f docker-compose.test.yml down` | 发版 | 0 |
| `build` | `./gradlew installDist`（或 `shadowJar`；产物可运行） | 发版 | 0 |
| `run` | `./gradlew run` | 本地 | 运行中 |

`fmt` / `lint` 与 [kotlin Language Gate](../meta/language-gates/kotlin.md) **逐字一致**（`check` 含二者）。
