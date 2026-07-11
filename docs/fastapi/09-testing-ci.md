# 09 — 测试与 CI

## 单测

`tests/`；`httpx.AsyncClient` + `ASGITransport(app=app)`。

| case | 期望 |
|------|------|
| 校验 / 未知字段 | VALIDATION shape |
| RequestID | 头回传 |
| service NOT_FOUND | 404 |
| Auth | 401/通过 |
| INTERNAL | message=`internal error` |

## 发版集成（必做矩阵）

跑法（与 `commands.md` / Makefile 同文）：

1. 复制 `templates/docker-compose.test.yml.example` → `docker-compose.test.yml` 
2. `export DATABASE_URL=postgresql+asyncpg://app:app@localhost:5432/app_test` 
3. `docker compose -f docker-compose.test.yml up -d --wait` 
4. `uv run alembic upgrade head` 
5. `uv run pytest -m integration`（覆盖矩阵；勿使用非标准 `-count`） 
6. `docker compose -f docker-compose.test.yml down`

| # | 场景 | 何时必跑 | 断言 |
|---|------|----------|------|
| 1 | GET /healthz | 总是 | 200 |
| 2 | GET /readyz | 总是 | 200 |
| 3 | 主写成功 | 总是 | 契约 status + 字段；若 §8=要须带合法 Idempotency-Key |
| 4 | 主写缺字段 | 总是 | 422 + code=VALIDATION |
| 5 | 受保护无票 | 仅鉴权≠无 | 401 |
| 6 | 多写中途失败 | 仅 §3 勾「多语句/多表=是」 | 无部分提交 |
| 7 | 缺 Idempotency-Key | 仅 §8=要 | 422 + code=VALIDATION |
| 8 | 同 key 重放 | 仅 §8=要 | status+body 字节一致 |

发版：`pytest -m integration` **收集数必须 ≥ 适用行数**（总是行 + 条件行）；收集 0 → 视为失败（在 `conftest` 用 session 钩子或显式 `assert` 计数）。 
`11` 超越-b：所有**适用**行绿。

## CI

| 触发 | 命令 |
|------|------|
| PR | `make check` |
| 发版 | `make check` + `make test-integration` |
