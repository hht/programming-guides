# 11 — 世界级验收

- [ ] INPUTS OK；实现在目标仓而非本指南仓  
- [ ] 写路径：simulate→write(request)→wait；hash≠成功  
- [ ] inflight + latch；RPC 与钱包 chainId 双校验  
- [ ] 地址表 + generate ABI；禁写 implementation  
- [ ] walletReady ≠ sessionReady；SIWE 服务端校验  
- [ ] 报价/授权/claim 按 [05](./05-read-write-money-path.md) 步骤  
- [ ] 每页三态 DoD；文案 i18n  
- [ ] `pnpm check`=0；发版 e2e=0（若 INPUTS 书面豁免 e2e，验收记录须附豁免与风险；默认不豁免）
