# 05 — Transaction Lifecycle（核心）

## 不变量

`BEGIN → 写 → 约束/RLS → COMMIT|ROLLBACK`。

超越：① CI 空库 migrate；② 事务失败无脏写探针。

## 步骤（钉死）

1. 单行不变量 → 约束。  
2. 跨表 → 显式事务（应用 API 或 `BEGIN`）。  
3. 隔离：INPUTS §10 或 **READ COMMITTED**。  
4. `SET LOCAL statement_timeout = '15s'`（在线事务默认；批处理 INPUTS 另给）。  
5. 捕获：`23505`→conflict；`23503`→validation；其它→internal；**必 ROLLBACK**。  
6. 死锁 `40001`：重试 ≤2，仍失败则 internal。  

## 探针

| case | 期望 |
|------|------|
| 事务中第二句失败 | 第一句不可见（已回滚） |
| 超时 | 回滚 |
