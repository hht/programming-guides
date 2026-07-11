# 00 — 原则与不变量

## 品类

应用用 Redis 做**缓存、分布式锁、限流、会话存储**之一或多；键空间可治理；失败模式明确（穿透 / 击穿 / 雪崩 / 锁误删）。

## 核心正确性路径（全文唯一）

**Cache-Aside Lifecycle**：读 = 查缓存 → 未命中 → 读权威源 → 回填（带 TTL）；写 = **先更新权威源** → 再失效或更新缓存。规格见 [04](./04-cache-aside-lifecycle.md)。锁 / 限流 / 会话为并列能力章，**不替代**本路径名。

## 硬不变量

1. **Redis ≥7**；客户端按语言钉死（go-redis / ioredis / redis-py），禁同语言双默认。  
2. **键 = 业务前缀 + 实体 + id**（见 `02`/`03`）；生产键**必须有 TTL 策略**（INPUTS §6）。  
3. **写路径**：禁止「只改缓存、不改权威源」，除非 INPUTS §7 显式勾选 **ephemeral-only**。  
4. **锁**：`SET key token NX EX ttl` 获取；释放须 **持有者 token 校验后删除**（Lua 或等价原子）；**禁裸 `DEL` 锁键**。  
5. **限流默认**：固定窗口 **`INCR` + 首次 `EXPIRE`**；Redis Cell / 滑动窗口近似为非默认先进选项（须 INPUTS 书面）。  
6. **会话**：鉴权语义 SSOT 在 [auth](../auth/README.md)；本册仅 Redis 存会话的可选路径；**禁明文 token**；auth 默认仍为 PG。  
7. **fail-closed（按能力）**：锁未持有不得进临界区；限流超限拒绝；会话不可达 → 对齐 auth fail-closed（未认证）。  
8. **deletion-first**：无第二套键约定、无平行「缓存框架」包装层。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 能力组合 / URL / TTL 表 / ephemeral | `INPUTS.md` |
| 键命名与前缀 | `02` + `03` + 目标仓词表 |
| Cache-Aside 步骤与写序 | `04-cache-aside-lifecycle.md` |
| 穿透/击穿/雪崩默认对策 | `05-cache-failure-modes.md` |
| 锁获取/释放 | `06-distributed-locks.md` |
| 限流算法默认 | `07-rate-limiting.md` |
| Redis 会话字段与 Cookie 边界 | `08` + [auth](../auth/README.md) |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行业务缓存/锁模块  
- 生产无 TTL 的「永久业务键」默许  
- 写路径只 `SET` 缓存不碰源（非 ephemeral-only）  
- 释放锁时无 token 校验的 `DEL`  
- 把 Redis 会话标成 auth 唯一默认（auth 默认 PG）  

## 超越（对照写入 11）

1. `对照：B 中更弱/未见「删锁必须持有者 token 校验」硬门闸 → 本指南要求 SET NX EX + token 校验删除，禁裸 DEL（见 06）`  
2. `对照：B 中更弱/未见「写路径禁止只改缓存不改源」硬门闸 → 本指南要求更新权威源后再失效/更新缓存，除非 INPUTS 声明 ephemeral-only（见 04）`  
