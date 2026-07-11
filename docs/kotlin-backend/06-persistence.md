# 06 — 持久化（Exposed / Flyway）

## 不变量

- Schema 变更只进 `src/main/resources/db/migration/`  
- 运行时表访问只经 Exposed `Table` / DSL；**禁止**路由拼 SQL 字符串  
- `DATABASE_URL` 必填（JDBC：`jdbc:postgresql://...`）  

## 步骤规格

1. Flyway：`V1__init.sql` 等；**默认进程启动时 `Flyway.migrate()`**（与 `03` 同文）；CI 集成测亦显式依赖已 migrate 的库。  
2. `Database.connect`：HikariCP DataSource → Exposed；`maximumPoolSize` 默认 **10**。  
3. `db/tables/`：每个业务表一个 `object Xxx : Table("xxx")`；列类型与迁移同构；改 schema = **先 migration 再改 Table**。  
4. 用例依赖：直接调 Exposed DSL，或抽 `interface` 便于 mock——**禁止**引入 Repository 套壳无行为。  
5. 事务：多语句用 `newSuspendedTransaction(Dispatchers.IO)`（或项目钉死的 dispatcher）；单语句可读/写可省略显式块（仍须在请求协程内）。  
6. `/readyz`：`TransactionManager`/`exec("SELECT 1")` ping。  

## 失败分类

| 情况 | 行为 |
|------|------|
| migrate 失败 | 进程退出 ≠0 |
| 唯一违反 | 映射 CONFLICT（经 `05` `from`） |
| 连接耗尽 | INTERNAL + 日志 |

## 单测探针

| case | 期望 |
|------|------|
| Flyway 脚本可 apply | 集成库 migrate 成功 |
| 用例 mock / 假 Table | 单测不强制起 Postgres |
| 集成（发版必做） | 见 `09` / `commands.md` `test-integration` |
