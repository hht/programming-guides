# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

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
        <resource>.py       # resource = 业务名
    models/                 # 含 sessions / idempotency_keys（若启用）
    schemas/
    <bc>/
      service.py            # 层文件；导出函数用业务动词，禁 UserService 类名
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

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`。  
2. `<bc>`、`<resource>`、表/JSON 字段根名 = **领域实体与操作**。  
3. **禁** `*Dto` `*Entity` `*Manager` `UserService`（类型）`handle_*` `process_*`。  
4. Pydantic 后缀 `Create`/`Read`/`Update` 只表示 **API 形状**；根名词必须是词表实体（`OrderCreate` 可，`PayloadDto` 禁）。  
5. path、错误码、OpenAPI 与词表同根。

| 概念 | 正例 | 反例 |
|------|------|------|
| 模块 | `app/orders/` | `app/order_manager/` |
| 路由文件 | `routes/orders.py` | `routes/entities.py` |
| 用例 | `def place_order(...)` | `def handle_create(...)` |
| Schema | `OrderCreate` | `OrderDto` / `EntityModel` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 包/模块 | snake_case（词来自 Pass 1） |
| Pydantic | `FooCreate` / `FooRead` / `FooUpdate` |
| 表名 | 复数 snake_case |
| 错误码 | `SCREAMING_SNAKE` |
| 资源 path | `/v1/` + 复数 |
| JSON 字段 | **snake_case** |
| 测试 | `test_*.py`；集成带 `@pytest.mark.integration` |
