# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

应用用 Redis 做缓存、分布式锁、限流、会话存储之一或多；键空间可治理；失败模式明确。

## 核心正确性路径（全文唯一）

**Cache-Aside Lifecycle**：查缓存 → 未命中 → 读权威源 → 回填（TTL）；写 = 先权威源再失效/更新缓存。规格见 [04](./04-cache-aside-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | Redis ≥7；同语言客户端唯一默认 | `01` |
| F02 | MUST | 键=业务前缀+实体+id；生产键有 TTL | `03`/INPUTS |
| F03 | MUST NOT | 只改缓存不改权威源（除非 ephemeral-only） | `04` |
| F04 | MUST | 锁 SET NX EX + 持有者 token 校验后删 | `06` |
| F05 | MUST NOT | 裸 DEL 锁键 | 同上 |
| F06 | MUST | 限流默认 INCR+首次 EXPIRE | `07` |
| F07 | MUST | 会话语义 SSOT 在 auth；禁明文 token | `08`+auth |
| F08 | MUST | fail-closed（锁/限流/会话） | 能力章 |
| F09 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 能力组合 / URL / TTL / ephemeral | `INPUTS.md` |
| 键命名与前缀 | `02` + `03` + 词表 |
| Cache-Aside 步骤与写序 | `04-cache-aside-lifecycle.md` |
| 穿透/击穿/雪崩 | `05` |
| 锁 | `06` |
| 限流 | `07` |
| Redis 会话 | `08` + [auth](../auth/README.md) |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
