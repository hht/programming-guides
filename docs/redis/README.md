# Redis — 缓存 / 锁 / 限流 / 会话存储指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **Redis** 键空间、Cache-Aside、分布式锁、限流与（可选）会话存储。 
> **默认栈**：Redis **≥7** + 客户端按应用册（**Go=go-redis** · **TS=ioredis** · **Python=redis-py**）+ 键名=业务前缀+实体+id + **TTL 必填**；会话默认仍对齐 [auth](../auth/README.md)（PG）；本册写 Redis session **可选路径**。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

应用用 Redis 做**缓存、分布式锁、限流、会话存储**之一或多；键空间可治理；失败模式明确（穿透 / 击穿 / 雪崩 / 锁误删）。

## 核心正确性路径

**Cache-Aside Lifecycle**（[04](./04-cache-aside-lifecycle.md)）：读 = 查缓存 → 未命中 → 源 → 回填；写 = 更新源 → 失效或更新缓存。锁 / 限流另章，**主路径仍是 Cache-Aside**。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；按「能力裁剪」只读必读章 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`） 
3. 必读 [03](./03-keyspace-and-ttl.md) + [04](./04-cache-aside-lifecycle.md)；按 INPUTS 能力勾选落地 [05](./05-cache-failure-modes.md) / [06](./06-distributed-locks.md) / [07](./07-rate-limiting.md) / [08](./08-session-store.md) 
4. [commands.md](./commands.md) `check` 绿 
5. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；能力互斥/组合勾选 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-keyspace-and-ttl.md) | 键空间与 TTL |
| [04](./04-cache-aside-lifecycle.md) | **Cache-Aside Lifecycle** |
| [05](./05-cache-failure-modes.md) | 穿透 / 击穿 / 雪崩 |
| [06](./06-distributed-locks.md) | SET NX EX + token 删锁 |
| [07](./07-rate-limiting.md) | 固定窗口（默认） |
| [08](./08-session-store.md) | Redis 会话可选路径（对齐 auth） |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | env / compose / schema 例 |
