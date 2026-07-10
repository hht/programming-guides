# 03 — 链上合约（规格）

## 硬规则

1. ABI 用 `@wagmi/cli` generate，或源码 `as const`；JSON import 不能当唯一类型源（viem/wagmi P0）  
2. 地址只放 `src/contracts/addresses/<env>/<chainId>.ts`，形状符合 [addresses.schema.json](./templates/addresses.schema.json)（必含 `env`）  
3. **禁止**对 `implementationOnly: true` 的地址 `writeContract`；只写 proxy/entrypoint/standalone  
4. `tsconfig.strict`；viem/wagmi 锁 patch  
5. custom error 必须进 ABI，供 simulate 解码  

## Agent 应自行实现（不要从本指南复制整文件）

- `getContractAddress(chainId, name)` / 可写地址校验  
- `wagmi.config.ts` + `createConfig` + `Register`  
- 统一写入口（见 [05](./05-read-write-money-path.md)）  

## 授权策略（产品选定一种默认）

| 策略 | 说明 |
|------|------|
| 精确额度 | 默认推荐 |
| 无限额 | 必须二次确认文案 |
| Permit2 | 仅合约已集成时；签名 UI ≠ 登录 |

特殊代币（先 `approve(0)`）写入代币表字段，勿散落 if。

## 工作流

```text
填地址表 → wagmi generate → tsc → 门闸单测 → testnet 冒烟 → prod 地址
```
