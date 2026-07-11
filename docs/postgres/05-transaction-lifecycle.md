# 05 — Transaction Lifecycle（核心）

> **全文唯一核心正确性路径。**  
> `BEGIN → 写 → 约束/RLS → COMMIT|ROLLBACK`（失败必回滚，禁止脏写对调用方可见）。

## 不变量

- 跨表不变量 **同事务**（与 `00` 一致）；单表单行约束靠 DB CHECK/UNIQUE，不靠「应用碰巧成对」。  
- 事务失败路径 **必 ROLLBACK**（或驱动等价 abort）；禁止 catch 后继续用同一连接当成功会话写后续业务。  
- 隔离级别：INPUTS §10 或默认 **`READ COMMITTED`**；改级别须书面 + 影响说明，禁止无说明升 `SERIALIZABLE`。  
- 在线事务默认 `SET LOCAL statement_timeout = '15s'`（批处理 / 长迁移由 INPUTS 另钉；禁止默认同用 15s 跑全表批）。  
- 应用错误码以本文件 **SQLSTATE 默认映射** 为准；INPUTS §9 可覆盖表，不得留「随意字符串」。  
- 超越：写路径事务失败 **无脏写探针**（见 `09` / `11` a2）。

## 步骤规格（钉死）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **判定是否开事务** | 单语句、且不变量可由单行约束保证 → 可省略显式事务（仍受 statement_timeout / RLS）。跨表 / 多语句 /「读后写」校验 → **必须**显式事务（应用 API `Begin`/`Tx` 或 `BEGIN`）。 |
| 2 | **BEGIN** | 取得连接后立即 `BEGIN`（或 ORM `transaction` 回调）；**禁止**跨请求复用未提交事务。 |
| 3 | **SET LOCAL** | 在事务内：`SET LOCAL statement_timeout = '15s'`（或 INPUTS 批处理值）；若启用 RLS（`06`）：同事务内 `set_config('app.tenant_id', …, true)` **先于**业务 DML。 |
| 4 | **写 / 读校验** | 按业务顺序执行 SQL；能进约束的不放应用碰运气。 |
| 5 | **约束 / RLS 生效** | UNIQUE / FK / CHECK / RLS 拒绝 → 进入失败分类；**不得**部分提交。 |
| 6 | **COMMIT 或 ROLLBACK** | 全部成功 → `COMMIT`。任一步失败 → **必 `ROLLBACK`**，再映射错误返回调用方。 |
| 7 | **死锁/序列化重试（有界）** | SQLSTATE **`40P01`**（deadlock_detected）或 **`40001`**（serialization_failure）：整段事务从步骤 2 **重试 ≤2 次**（合计最多 3 次尝试）；仍失败 → `internal`（或 INPUTS 映射名）。重试前必须已 ROLLBACK。默认隔离 READ COMMITTED 时以 `40P01` 为主；升隔离后才常见 `40001`。 |

### 伪代码（规格级，非实现）

```text
run_tx(work):
  attempt = 0
  while true:
    attempt += 1
    conn = pool.acquire()
    try:
      BEGIN
      SET LOCAL statement_timeout = '15s'   // or INPUTS batch
      // if RLS: set_config('app.tenant_id', tenant, true)
      work(conn)
      COMMIT
      return ok
    catch sql as e:
      ROLLBACK   // always
      if e.sqlstate in ('40P01', '40001') and attempt < 3:  // 合计最多 3 次
        continue
      return map_sqlstate(e)   // table below
    finally:
      pool.release(conn)       // never return a live open tx
```

## 失败分类 / 默认 SQLSTATE 映射

| SQLSTATE / 条件 | 应用码（默认） | 行为 |
|-----------------|----------------|------|
| `23505` unique_violation | `conflict` | ROLLBACK；可对用户展示冲突字段（若可知） |
| `23503` foreign_key_violation | `validation` | ROLLBACK；禁当 internal 吞掉 |
| `23514` check_violation | `validation` | ROLLBACK |
| `23502` not_null_violation | `validation` | ROLLBACK |
| `40P01` deadlock_detected / `40001` serialization_failure | 重试后仍失败 → `internal` | 有界重试见步骤 7；**禁**把死锁只写成 `40001` |
| `57014` query_canceled（含 statement_timeout） | `timeout` | ROLLBACK；**禁止**当成功重试无界 |
| 连接丢失 / 无法 BEGIN | `store_unavailable` | 不假装已写 |
| 其它 | `internal` | ROLLBACK；记 SQLSTATE 供排障，禁 raw 堆栈给终端用户 |

INPUTS §9 可改「应用码」列名以对接宿主 API；**不得**删「必 ROLLBACK」列语义。

## 禁令（钉死）

- **禁止**在事务内调用不可回滚外部副作用（扣款、发信、推队列）而不做补偿设计；默认：**先提交 DB，再** outbox/队列（对接 [workers-queue](../workers-queue/README.md) 时用 outbox 行同事务写入）。  
- **禁止** `COMMIT` 后再根据「可能失败的后续步骤」假定行已对用户可见却不处理失败（须有补偿或状态机）。  
- **禁止**嵌套 `BEGIN` 当独立事务（PG 无真嵌套）；需要部分回滚 → **SAVEPOINT** 须在代码审查注明范围，默认不用。  
- **禁止**长事务持有行锁做用户交互等待（禁「打开表单就 BEGIN」）。

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 事务中第二句失败 | 第一句提交后不可见（已 ROLLBACK）；无脏写 |
| `23505` | 映射 `conflict`；连接可继续新事务 |
| `statement_timeout` | ROLLBACK；码 `timeout`；无部分可见写 |
| 死锁 `40P01` 首次 | 自动重试；最终成功则仅最终态可见 |
| 序列化失败 `40001`（若升隔离） | 同有界重试 |
| 死锁/序列化耗尽重试 | `internal`；无脏写 |
| 跨表两写省略事务 | **视为缺陷**（评审/静态约定：多语句写路径必须走 `run_tx`） |
| RLS 租户未 set 即写（若启用） | 失败或 0 影响行；不得写入他租户（与 `06` 联测） |
