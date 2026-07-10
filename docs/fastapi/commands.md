# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `sync` | `uv sync` | 改依赖后 | 0 |
| `migrate` | `uv run alembic upgrade head` | 本地/发版 | 0 |
| `test` | `uv run pytest`（`addopts` 已排除 integration） | PR | 0 |
| `lint` | `uv run ruff check . && uv run ruff format --check .` | PR | 0 |
| `typecheck` | `uv run mypy app` | PR | 0 |
| `check` | `uv sync && uv run ruff check . && uv run ruff format --check . && uv run mypy app && uv run pytest` | PR | 0 |
| `test-integration` | `export DATABASE_URL=postgresql+asyncpg://app:app@localhost:5432/app_test && docker compose -f docker-compose.test.yml up -d --wait && uv run alembic upgrade head && uv run pytest -m integration && docker compose -f docker-compose.test.yml down` | 发版 | 0 |
| `openapi` | `uv run python -c "from app.main import create_app; import json; json.dump(create_app().openapi(), open('openapi.json','w'), indent=2)"` | 契约变更 | 0 |
| `run` | `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000` | 本地 | 运行中 |
