# 来源、标杆与差距表

## 证据等级

P0 > P1 > P1w > E。冲突时先进优先（元指南 §3.4）。

## P0

| 主题 | URL |
|------|-----|
| FastAPI | https://fastapi.tiangolo.com/ |
| Pydantic v2 | https://docs.pydantic.dev/latest/ |
| SQLAlchemy 2.0 | https://docs.sqlalchemy.org/en/20/ |
| Alembic | https://alembic.sqlalchemy.org/ |
| asyncio | https://docs.python.org/3/library/asyncio.html |
| uv | https://docs.astral.sh/uv/ |
| ruff | https://docs.astral.sh/ruff/ |
| pytest-asyncio | https://pytest-asyncio.readthedocs.io/ |

## 标杆 \(B\)（3 开源）

| ID | 仓库 | 品类匹配 | 学什么 | 不学什么 |
|----|------|----------|--------|----------|
| A | [fastapi/full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template) | 官方 FastAPI+Postgres 全栈模板 | 目录、Alembic、Docker、测试布局 | 整仓抄 React 前端与云产品绑死 |
| B | [fastapi-users/fastapi-users](https://github.com/fastapi-users/fastapi-users) | FastAPI 用户/鉴权 API | 鉴权路由、依赖注入、密码/JWT 面 | 绑死其具体 ORM 适配器全家桶 |
| C | [zhanymkanov/fastapi-best-practices](https://github.com/zhanymkanov/fastapi-best-practices) | FastAPI 工程约定 | 分层、配置、错误与项目结构共识 | 当可运行业务实现抄袭 |

## 能力切条 → 共有

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| HTTP JSON API | ✓ | ✓ | ✓ | 必做 |
| 鉴权或明确无鉴权 | ✓ | ✓ | ✓ | 必做 |
| 持久化 + 迁移 | ✓ | ✓ | ✓ | 必做 |
| 结构化错误 / 校验 | ✓ | ✓ | ✓ | 必做 |
| 配置/环境分离 | ✓ | ✓ | ✓ | 必做 |
| 健康检查 / 可测布局 | ✓ | ✓ | ✓ | 必做 |

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做/可选/参考 |
|------|------|------|------|----------------|
| Pydantic v2 请求/响应模型 | P0 | 工程 | `04`/`05` | 必做 |
| SQLAlchemy 2.0 async Session | P0（先进于同步默认） | 工程 | `06` | 必做 |
| Request ID + structlog 绑定 | E 强化 | 工程 | `05` | 必做（超越） |
| 多语句写显式事务 | E | 功能 | `05` | 必做（超越） |
| uv 锁文件 | P0 uv | 工程 | `01` | 必做 |
| OTel/Sentry | — | 参考 | `08` | 参考 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| 官方模板默认 SQLModel | **钉 SQLAlchemy 2.0 async + Mapped**（类型与会话边界更清晰；SQLModel 不进默认） |
| Poetry / pip-tools 仍流行 | **钉 uv**（锁文件 + 速度；先进优先） |
| Django REST 更「企业」 | **钉 FastAPI**（本指南品类；异步与 OpenAPI 一等） |
| sync Session 更简单 | **钉 async**（`AsyncSession`；禁默认同步阻塞路由） |
