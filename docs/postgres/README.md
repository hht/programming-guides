# PostgreSQL 数据层指南

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **PostgreSQL** 建模、迁移、事务与 RLS。 
> **默认栈**：PostgreSQL ≥16 + **Atlas**（SQL 迁移 SSOT）+ Compose 本地库 + 应用侧客户端由对位指南写明。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

应用通过 SQL 正确持久化业务状态：模式可演进、写路径事务原子、行级权限可强制。

## 核心正确性路径

**Transaction Lifecycle**（[05](./05-transaction-lifecycle.md)）。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md) 
3. [03](./03-modeling.md) / [04](./04-migrations.md) / [05](./05-transaction-lifecycle.md) 
4. [06](./06-rls-and-tenancy.md) / [07](./07-connections-and-pooling.md) / [08](./08-observability-backup.md) 
5. [commands.md](./commands.md) `check` 绿 
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 索引

| 文档 | 用途 |
|------|------|
| INPUTS / 00–11 / commands / sources / templates | 规格与模板 |
