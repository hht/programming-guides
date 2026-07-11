# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [kotlin Language Gate](../meta/language-gates/kotlin.md)。本文件只含 **Ktor 后端 MUST**（Compose UI 不在本册）。

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 路由/`call` 只做解码/编码/status；业务在 `<bc>/` | 单测 |
| F02 | MUST | 下游 DB/HTTP 出站在 suspend 路径 | 代码抽检 |
| F03 | MUST NOT | 在请求路径 `runBlocking`（除 `main`/测试夹具） | 同上 |
| F04 | MUST | 领域错误 → 稳定 `code` + HTTP status；未知 → `INTERNAL` + 日志 | `09` |
| F05 | MUST NOT | 把内部异常字符串直接回客户端 | 同上 |
| F06 | MUST | SQL 只经 Exposed Table/DSL + Flyway SQL | 路由无业务 SQL 字符串 |
| F07 | MUST | 跨多表或多语句写必须显式事务 | 单测 |
| F08 | MUST | 缺必填 env → `main` 非 0 退出 | 启动探针 |
| F09 | MUST | deletion-first；无 INPUTS 的端点不做 | INPUTS |

## SSOT

| 真相 | Owner |
|------|--------|
| 路由 | `http/Routing.kt`（或等价单处 `configureRouting`） |
| OpenAPI / 端点契约 | INPUTS → 仓内 **`openapi.yaml`**（唯一） |
| SQL schema | `src/main/resources/db/migration/`（Flyway） |
| 表映射 | `db/tables/`（Exposed `Table`；与迁移同构，禁漂移） |
| 配置 | `config/`（env → typed settings） |
| 错误码 | `apierrors/` |
| 日志 | SLF4J + Logback（生产 JSON） |

## 超越对照

1. `对照：B 中更弱/未见「请求路径强制 request_id 写入日志 MDC 与响应头」硬门闸 → 本指南要求`  
2. `对照：B 中更弱/未见「多表写必须显式事务否则禁止合并提交」硬门闸 → 本指南要求`
