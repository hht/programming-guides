# 06 — 持久化（sqlc / pgx / migrate）

## 不变量

- Schema 变更只进 `migrations/` 
- 查询只进 `sql/queries/` → `sqlc generate` 
- 运行时用 `pgxpool`；`DATABASE_URL` 必填 

## 步骤规格

1. `migrations/0001_init.up.sql` + `.down.sql`；CI/启动 `migrate up`。 
2. `sqlc.yaml` 指向 queries；生成包 `internal/db`。 
3. Service 依赖接口：

```text
type Querier interface {
 // sqlc 生成方法子集，便于 mock
}
```

4. 事务：`pgx.Tx` 实现同一 Querier（sqlc 支持）；service 内开启。 
5. 连接池：`MaxConns` 默认 **10**（可配置）；`Ping` 用于 `/readyz`。 

## 失败分类

| 情况 | 行为 |
|------|------|
| migrate 失败 | 进程退出 1 |
| 唯一违反 | 映射 CONFLICT |
| 连接耗尽 | INTERNAL + 日志 |

## 单测探针

| case | 期望 |
|------|------|
| sqlc 生成可编译 | `go build ./...` |
| 仓库 mock | service 单测不启 Postgres |
| 集成（发版必做） | 见 `09` / `commands.md` `test-integration`（非可选） |
