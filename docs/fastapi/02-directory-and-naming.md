# 02 — 目录与命名

## 树（钉死）

```text
<repo>/
  pyproject.toml
  uv.lock
  alembic.ini
  openapi.json
  app/
    main.py                 # create_app() + 模块级 app=
    core/
      config.py
      errors.py
      logging.py
      security.py
      middleware.py         # BodyLimit、RequestID
    db/
      session.py
      base.py
    api/
      deps.py
      router.py
      routes/
        health.py
        auth.py             # 若 Session/登录
        <resource>.py
    models/                 # 含 sessions / idempotency_keys（若启用）
    schemas/
    <bc>/
      service.py            # 禁另造 repository 层；查询在 service+models
  alembic/
    env.py
    versions/
  tests/
    conftest.py
    test_health.py
    test_<bc>.py
    test_integration_matrix.py   # marker=integration
  docker-compose.test.yml
  Makefile
```

## 依赖方向

```text
main → api.routes → <bc>.service → models/db
                → schemas
                → core
```

禁止：`utils/` 大口袋；路由内直接写业务 SQL；循环 import。

## 命名

| 种类 | 规则 |
|------|------|
| 包/模块 | snake_case |
| Pydantic | `FooCreate` / `FooRead` / `FooUpdate` |
| 表名 | 复数 snake_case |
| 错误码 | `SCREAMING_SNAKE` |
| 资源 path | `/v1/` + 复数 |
| JSON 字段 | **snake_case** |
| 测试 | `test_*.py`；集成带 `@pytest.mark.integration` |
