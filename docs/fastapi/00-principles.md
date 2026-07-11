# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [python Language Gate](../meta/language-gates/python.md)。本文件只含 **FastAPI 框架 MUST**。

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | path operation 只做依赖注入、调用 service、返回 schema；业务在 `app/<bc>/service.py` | 目录/单测 |
| F02 | MUST | 路由与 DB 访问用 `async def` + `AsyncSession` | 代码抽检 |
| F03 | MUST NOT | 在请求路径使用 `time.sleep` / 同步阻塞 ORM | 同上 |
| F04 | MUST | 领域错误 → 稳定 `code` + HTTP status；未知 → `INTERNAL` + 日志 | `09` case |
| F05 | MUST NOT | 把内部 exception 字符串回客户端 | 同上 |
| F06 | MUST | SQL 只经 SQLAlchemy 模型/查询（+ Alembic） | 路由无业务 SQL 字符串 |
| F07 | MUST | 跨多表或多语句写必须显式事务；成功才 commit | 单测/集成 |
| F08 | MUST | 缺必填 env → 进程非 0 退出（启动校验） | 启动探针 |
| F09 | MUST | `create_app()` 工厂 + `app = create_app()`（见 `01`） | 导入抽检 |
| F10 | MUST | deletion-first；无 INPUTS 的端点不做 | INPUTS 门闸 |

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
