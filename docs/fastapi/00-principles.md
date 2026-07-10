# 00 — 原则与不变量

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 硬不变量

1. **路由薄**：path operation 只做依赖注入、调用 service、返回 schema；业务在 `app/<bc>/service.py`。  
2. **async 贯穿**：路由与 DB 访问用 `async def` + `AsyncSession`；禁止在请求路径 `time.sleep` / 同步阻塞 ORM。  
3. **错误分类**：领域错误 → 稳定 `code` + HTTP status；未知 → `INTERNAL` + 日志；**禁止**把内部 exception 字符串回客户端。  
4. **SQL 只经 SQLAlchemy 模型/查询**（+ Alembic）；禁止在路由拼业务 SQL 字符串。  
5. **写路径事务**：跨多表或多语句写必须显式事务；成功才 commit。  
6. **配置 fail-fast**：缺必填 env → 进程非 0 退出（启动时校验）。  
7. **deletion-first**；无 INPUTS 的端点不做。

## SSOT

| 真相 | Owner |
|------|--------|
| 路由挂载 | `app/main.py` 或 `app/api/router.py`（单处 include） |
| OpenAPI | FastAPI 生成 → 仓根 `openapi.json` |
| Schema / 表 | Alembic `versions/` + `app/models/` |
| 配置 | `app/core/config.py`（pydantic-settings） |
| 错误码 | `app/core/errors.py` |
| 日志 | structlog（JSON 渲染生产） |

## 超越对照

1. `对照：B 中更弱/未见「请求路径强制 request_id 写入日志与响应头」硬门闸 → 本指南要求`  
2. `对照：B 中更弱/未见「多表/多语句写必须显式事务」硬门闸 → 本指南要求`
