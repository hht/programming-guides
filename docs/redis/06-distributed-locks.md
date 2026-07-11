# 06 — 分布式锁

> P0：[Distributed locks with Redis](https://redis.io/docs/manual/patterns/distributed-locks/)（及 redis.io docs 现行等价页）。  
> 本册默认：**单实例 Redis 上的安全互斥**（`SET NX EX` + token）；**不是**完整 Redlock 多节点共识课。多节点 Redlock 仅当 INPUTS 书面选用并接受其争议边界。

## 不变量

- 获取：`SET lock_key token NX EX ttl`（`token` = 高熵持有者标识，≥128 bit）。  
- 释放：**仅当当前值 == token** 时删除（原子：Lua `if redis.call("GET",KEYS[1])==ARGV[1] then return redis.call("DEL",KEYS[1]) else return 0 end`）。  
- **禁裸 `DEL lock_key`**（可误删他人锁）。  
- 锁 TTL ≥ 临界区最坏耗时上界；超时未完成 → 视为丢失，调用方须幂等/可重入设计外的失败处理。

## 步骤规格（实现自写）

1. **Acquire**  
   - `token = random()`。  
   - `ok = SET key token NX EX ttl`；`ok` 假 → `LOCK_NOT_ACQUIRED`（可重试带 backoff，次数 INPUTS 或默认 ≤3）。  
2. **Hold**  
   - 临界区内业务；**不**在持锁时做无界外部等待。  
   - 可选续期（watchdog）仅当 INPUTS 勾选；默认不续期，靠足够 TTL。  
3. **Release**  
   - 执行 token 校验删除脚本；返回 0 → `LOCK_NOT_HELD`（已过期被他人获取或 token 错）。  
   - **禁止** `DEL` 无校验。  
4. **键名**  
   - `{prefix}lock:{resource}`；resource 业务词根 + id。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| NX 失败 | `LOCK_NOT_ACQUIRED`；不进临界区 |
| 释放 token 不匹配 | `LOCK_NOT_HELD`；不假装解锁成功 |
| Redis 不可达 | fail-closed：视为未持锁 |
| TTL 内未完成 | 锁可能被他人获取；业务须幂等或检测 fence（可选进阶） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 双客户端争锁 | 仅一方 Acquire 成功 |
| 持有者正确释放 | 键删除；他方可再 Acquire |
| 非持有者 DEL/释放 | 键仍在；持有者仍持有（或返回 NOT_HELD） |
| 裸 DEL 代码路径 | **lint/测试禁止**或审查红灯 |
