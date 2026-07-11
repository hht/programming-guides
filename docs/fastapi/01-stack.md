# 01 — 默认栈

## 栈表

| 层 | 选择 | 备注 |
|----|------|------|
| 语言 | **Python ≥3.12** | `requires-python`；CI 同主版本 |
| 包管理 | **uv** | `uv.lock` 提交 |
| Web | **fastapi** | 最新稳定；Starlette 随其 |
| 校验 | **pydantic v2** | |
| 设置 | **pydantic-settings** | |
| ORM | **SQLAlchemy ≥2.0** async | `AsyncSession` + `Mapped[]` |
| 驱动 | **asyncpg** | Postgres |
| 迁移 | **alembic** | |
| 服务端 | **uvicorn[standard]** | |
| 日志 | **structlog** | 生产 JSON |
| HTTP 出站 | **httpx** | |
| 测试 | **pytest** + **pytest-asyncio** + **httpx** | `asyncio_mode=auto` |
| Lint/格式 | **ruff** | check + format；命令 SSOT → [python Language Gate](../meta/language-gates/python.md) |
| 类型 | **mypy** | `strict = true`（可按生成代码放宽）；命令见 gate |
| JWT（仅 Bearer/IdP） | **PyJWT** | |
| 密码（仅 Session） | **argon2-cffi** | |
| UUID | stdlib `uuid` | Request ID |

**禁止开口**：Django/Flask 任选、同步 SQLAlchemy Session 默认、Poetry 默认、SQLModel 默认、flake8 平行第二套。  
语言硬门闸：[python.md](../meta/language-gates/python.md)（**不**在本文件复述）。

## 脚手架

```bash
mkdir <name> && cd <name>
uv init
# 布局规定为仓根 app/（勿用 src 布局）：创建 app/__init__.py 等按 02；pyproject 中
# [project] name **必须**为 `app`（与 INPUTS §1 / 导入包同文）；若 uv 生成了 src/，删除并改为包路径 app
uv add fastapi "uvicorn[standard]" pydantic pydantic-settings sqlalchemy asyncpg alembic structlog httpx
uv add --dev pytest pytest-asyncio ruff mypy
# 若 INPUTS 选 Bearer JWT：
uv add pyjwt
```

`pyproject.toml` 须含：

```toml
[tool.ruff]
[tool.mypy]
strict = true
[tool.pytest.ini_options]
asyncio_mode = "auto"
addopts = "-m 'not integration'"
markers = ["integration: needs Postgres"]
```

包发现：`[tool.setuptools.packages.find] where = ["."] include = ["app*"]`（或等价，保证 `import app`）。

脚手架续：

```bash
uv run alembic init -t async alembic
# 按 06 改 env.py；按 02 建 app/ 树
```

`app/main.py` 必须：`def create_app() -> FastAPI: ...` 且 **`app = create_app()`**。

## 锁版本

提交 `uv.lock`；升级走 PR + `uv run pytest`。
