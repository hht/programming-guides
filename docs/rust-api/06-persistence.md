# 06 — 持久化（sqlx / migrate）

## 不变量

- Schema 变更只进 `migrations/` 
- 业务查询用 **sqlx**（`query!` / `query_as!` / `query_scalar!`）；禁止 handler 拼字符串 SQL 
- 运行时用 `sqlx::PgPool`；`DATABASE_URL` 必填 
- CI 无 DB 时：`cargo sqlx prepare` 产物进 **`.sqlx/`** 并提交（或文档约定「CI 起 Postgres」二选一；**默认提交 `.sqlx/`**）

## 步骤规格

1. `migrations/0001_init.sql`（或 `.up.sql`/`.down.sql` 对——仓内选定一种；**默认 sqlx 可逆单文件版本链**）；CI/启动 `sqlx migrate run`。 
2. Service 依赖接口（便于 mock）：

```text
// 业务仓储 trait：方法名=业务；实现持有 &PgPool 或 &mut Transaction
#[async_trait::async_trait]
trait OrdersRepo {
 async fn get(&self, id: Uuid) -> Result<Option<Order>, sqlx::Error>;
 // …
}
```

> `async_trait` 可选；Rust ≥1.75+ 可用 RPITIT / 手写 async fn in trait（edition 与 MSRV 一致时选定一种）。

3. 事务：`let mut tx = pool.begin().await?`；业务语句走 `&mut *tx`；成功 `tx.commit()`。 
4. 连接池：`max_connections` 默认 **10**（可配置）；`readyz` 用 acquire + `SELECT 1`。 
5. 离线宏：开发改查询后跑 `cargo sqlx prepare`；CI `SQLX_OFFLINE=true cargo build`。 

## 失败分类

| 情况 | 行为 |
|------|------|
| migrate 失败 | 进程退出 1 |
| 唯一违反 | 映射 CONFLICT |
| 连接耗尽 | INTERNAL + 日志 |

## 单测探针

| case | 期望 |
|------|------|
| sqlx 宏可编译 | `SQLX_OFFLINE=true cargo build` |
| Repo mock | service 单测不启 Postgres |
| 集成（发版必做） | 见 `09` / `commands.md` `test-integration`（非可选） |
