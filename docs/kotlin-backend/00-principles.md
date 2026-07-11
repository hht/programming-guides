# 00 — 原则与不变量

## 决策优先级

正确性 > 可验证性 > 简洁性 > 复用 > 速度。

## 硬不变量

1. **Route 薄**：路由/`call` 只做解码/编码/status；业务在 `<bc>/` 用例，可单测。 
2. **协程贯穿**：下游 DB/HTTP 出站必须在 suspend 路径；禁止在请求路径 `runBlocking`（除 `main`/测试夹具）。 
3. **错误分类**：领域错误 → 稳定 `code` + HTTP status；未知 → `INTERNAL` + 日志，**禁止**把内部异常字符串直接回客户端。 
4. **SQL 只经 Exposed Table/DSL + Flyway SQL**；禁止在路由拼业务 SQL 字符串。 
5. **写路径事务**：跨**多表或多语句**写必须显式事务（`transaction` / `newSuspendedTransaction`）；单语句可无显式 begin。 
6. **配置 fail-fast**：缺必填 env → `main` 非 0 退出。 
7. **deletion-first**；无 INPUTS 的端点不做。

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
