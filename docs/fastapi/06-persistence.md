# 06 — 持久化（SQLAlchemy / Alembic）

## 不变量

- Schema 变更只进 `alembic/versions/`  
- 运行时用 `create_async_engine` + `async_sessionmaker`  
- `DATABASE_URL` 必填；驱动前缀 **`postgresql+asyncpg://`**  

## 步骤规格

1. `app/db/session.py`：engine、`AsyncSession` factory；`get_session` yield session，请求结束关闭。  
2. 模型：`Mapped[]` + `mapped_column`；禁 legacy `Column` 主风格。  
3. Alembic：`env.py` 使用 async；`upgrade head` 在 CI/启动策略二选一，**默认独立 migrate job**（与 compose 集成测显式跑）；本地 `make migrate`。  
4. Service 注入 `AsyncSession`；事务见 `05`。  
5. 池参数默认见 `03`。  

## 失败分类

| 情况 | 行为 |
|------|------|
| migrate 失败 | 进程/job exit ≠0 |
| 唯一违反 | CONFLICT |
| 连接耗尽 | INTERNAL + 日志 |

## 单测探针

| case | 期望 |
|------|------|
| 模型 metadata 可 create | 测试库 migrate 后 select |
| service mock session | 单测不强制起 Postgres |
| 集成 | 见 `09` `test-integration` |
