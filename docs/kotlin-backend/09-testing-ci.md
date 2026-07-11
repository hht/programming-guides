# 09 — 测试与 CI

## 单测

`src/test/kotlin`；`testApplication { application { module() } }`（ktor-server-test-host）。

| case | 期望 |
|------|------|
| 校验 / 未知字段 | VALIDATION shape |
| RequestID | 头回传 |
| 用例 NOT_FOUND | 404 |
| Auth | 401/通过 |
| INTERNAL | message=`internal error` |

## 发版集成（必做矩阵）

跑法（与 `commands.md` / Makefile 同文）：

1. 复制 `templates/docker-compose.test.yml.example` → `docker-compose.test.yml` 
2. `export DATABASE_URL=jdbc:postgresql://localhost:5432/app_test?user=app&password=app`（与 compose 例同文） 
3. `docker compose -f docker-compose.test.yml up -d --wait` 
4. Flyway 随应用启动或 `./gradlew flywayMigrate`（选定一种；默认与生产同：启动 migrate） 
5. `./gradlew test -PincludeTags=integration`（或 `@Tag("integration")` 过滤；覆盖矩阵） 
6. `docker compose -f docker-compose.test.yml down`

| # | 场景 | 何时必跑 | 断言 |
|---|------|----------|------|
| 1 | GET /healthz | 总是 | 200 |
| 2 | GET /readyz | 总是 | 200 |
| 3 | 主写成功 | 总是 | 契约 status + 字段；若 §8=要须带合法 Idempotency-Key |
| 4 | 主写缺字段 | 总是 | 400 + code=VALIDATION |
| 5 | 受保护无票 | 仅鉴权≠无 | 401 |
| 6 | 多写中途失败 | 仅 §3 勾「多语句/多表=是」 | 无部分提交 |
| 7 | 缺 Idempotency-Key | 仅 §8=要 | 400 + code=VALIDATION |
| 8 | 同 key 重放 | 仅 §8=要 | status+body 字节一致 |

发版：integration 测试 **收集数必须 ≥ 适用行数**；收集 0 → 视为失败。 
`11` 超越-b：所有**适用**行绿。

## CI

| 触发 | 命令 |
|------|------|
| PR | `make check` |
| 发版 | `make check` + `make test-integration` |
