# FastAPI HTTP API 开发指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**从零实现世界级门槛的 FastAPI HTTP API。 
> **默认栈**：Python ≥3.12 + **uv** + **FastAPI** + **Pydantic v2** + **SQLAlchemy 2.0 async** + **asyncpg** + **Alembic** + **structlog** + pytest + ruff + mypy。 
> **来源**：[sources.md](./sources.md) 
> **对位**：[../go/](../go/README.md)（同品类、不同语言）

## 品类一句话

客户端通过 **HTTP JSON API** 完成读/写业务；请求可追踪、错误可分类、写路径在事务边界内正确提交或回滚。

## 核心正确性路径（全文唯一）

**Request Lifecycle**：`接入 → 中间件/依赖注入 ctx → 解码+校验 → 应用用例 → 持久化(事务) → 编码响应 → 正确 status`。

## Agent 执行协议

1. 校验 [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或列缺口（停） 
2. 按 [01](./01-stack.md) 用 **uv** 建项目；目录按 [02](./02-directory-and-naming.md) 
3. 按 [03](./03-http-server.md) 落地 app/路由/超时/生命周期 
4. 按 [04](./04-errors-and-validation.md) / [05](./05-request-lifecycle.md) / [06](./06-persistence.md) 实现核心路径（**自写，勿抄业务模块**） 
5. 按 [07](./07-auth.md) / [08](./08-quality.md) 接鉴权与质量 
6. 复制 templates：`Makefile.snippet`→`Makefile`；`docker-compose.test.yml.example`→`docker-compose.test.yml`；`env.example`→`.env.example`；主写完成后 `make openapi` 
7. [commands.md](./commands.md)：`make check`；发版前 **`make test-integration`** 
8. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) 全勾 

## 文档索引

| 文档 | 用途 |
|------|------|
| [INPUTS.md](./INPUTS.md) | 输入门闸 |
| [00-principles.md](./00-principles.md) | 不变量 |
| [01-stack.md](./01-stack.md) | 栈 |
| [02-directory-and-naming.md](./02-directory-and-naming.md) | 目录 |
| [03-http-server.md](./03-http-server.md) | HTTP 服务 |
| [04-errors-and-validation.md](./04-errors-and-validation.md) | 错误 / 校验 |
| [05-request-lifecycle.md](./05-request-lifecycle.md) | 核心路径 |
| [06-persistence.md](./06-persistence.md) | SQLAlchemy / Alembic |
| [07-auth.md](./07-auth.md) | 鉴权 |
| [08-quality.md](./08-quality.md) | 质量 |
| [09-testing-ci.md](./09-testing-ci.md) | 测试 |
| [10-checklist.md](./10-checklist.md) | 清单 |
| [11-world-class-acceptance.md](./11-world-class-acceptance.md) | 验收 |
| [commands.md](./commands.md) | 命令 |
| [sources.md](./sources.md) | 标杆 |
| [templates/](./templates/README.md) | 非业务碎片 |

## 心智模型

```text
INPUTS → uv + FastAPI → 依赖注入 → Request Lifecycle → Alembic → check → 验收
```
