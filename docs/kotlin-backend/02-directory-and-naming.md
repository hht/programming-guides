# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树

```text
<repo>/
 settings.gradle.kts
 build.gradle.kts
 gradle/
 libs.versions.toml
 wrapper/
 openapi.yaml
 src/main/kotlin/<package>/
 Application.kt # main + Application.module()
 config/
 Settings.kt # env → typed；缺必填 fail-fast
 apierrors/
 AppError.kt
 StatusPages.kt # 统一 JSON 错误
 http/
 Routing.kt # 路由 SSOT：health + /v1
 plugins/
 RequestId.kt
 CallLogging.kt
 auth/ # 鉴权插件与解析（按 INPUTS）
 db/
 Database.kt # Hikari + Exposed connect + Flyway
 tables/ # Exposed Table；与 migration 同构
 <bc>/ # 例 orders、billing —— 业务名
 Routes.kt # 薄路由
 <Bc>.kt # 用例编排（文件/类型=业务，禁 *Service 后缀类型）
 src/main/resources/
 logback.xml
 db/migration/ # Flyway V1__....sql
 src/test/kotlin/<package>/
 HealthTest.kt
 <Bc>Test.kt
 IntegrationMatrixTest.kt # @Tag("integration")
 docker-compose.test.yml
 Makefile
```

## 依赖方向

```text
Application → http.Routing → <bc>.Routes → <bc> 用例 → db.tables / transaction
 → auth
 → config
 → apierrors
```

禁止：`utils/`、`common/`、`models/` 大口袋；路由内直接 `Transaction` 拼业务 SQL 绕过用例（`/healthz`/`/readyz` 除外）；循环依赖。

UI 状态矩阵：本品类默认 **N/A**（HTTP API，无产品 UI 四态交付；a11y 裁剪见 `11`）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`。 
2. **`<bc>` 包名** = 业务资源/能力（`orders`、`billing`），禁 `core`/`common`/`manager`。 
3. 导出函数/类型 = 业务操作与实体（`placeOrder`、`Order`），**禁** `OrderService`、`OrderDto`、`handleCreate`、`processRequest`。 
4. HTTP path、错误码、OpenAPI `operationId` 与词表同根；改名=契约变更。 
5. `Routes.kt` 是**层文件名**，不是给类型挂 `*Service` 后缀的借口。 
6. kotlinx.serialization 的 `*Create`/`*Read`/`*Update` 只表示 **API 形状**；根名词必须是词表实体（`OrderCreate` 可，`PayloadDto` 禁）。

| 概念 | 正例 | 反例 |
|------|------|------|
| 包 | `<package>.orders` | `<package>.order_manager` |
| 用例 | `fun placeOrder(...)` / `class Orders`（类型=业务上下文） | `fun handleCreate(...)` / `class OrderService` |
| 错误码 | `ORDER_NOT_FOUND` | `ERR_404` / `ENTITY_MISSING` |
| 序列化 | `OrderCreate` | `OrderDto` / `EntityModel` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 包名 | 全小写；bc 用复数资源名（来自 Pass 1） |
| 文件/类 | PascalCase；函数 camelCase |
| Flyway | `V{version}__{business_name}.sql` |
| Exposed 表对象 | `Orders` / `OrderTable`——根名=业务实体复数 |
| 错误码 | `SCREAMING_SNAKE` 与 INPUTS / 词表一致 |
| 资源 path | `/v1/` + 复数 |
| JSON 字段 | **snake_case**（`@SerialName` 或全局 `Json { namingStrategy }` 选定一种） |
| 测试 | `*Test.kt`；集成带 `@Tag("integration")` |
