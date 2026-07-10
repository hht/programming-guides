# 页面三态配方（逐页 DoD）

每个 Figma frame 对应一页时，实现下表（无后端登录则合并 connected=sessionReady）。

| 态 | CTA | 数据 | 空/错态 |
|----|-----|------|---------|
| `disconnected` | Connect | 公开链上读 | 引导连接 |
| `connected` | Sign in（若需 API）；纯链上可走 writeReady CTA | 个人链上读 | 错链 → switchChain |
| `sessionReady` | 业务主 CTA | API + 链上 | 门闸文案内联 |

## 逐页 Definition of Done

- [ ] 三态齐全且映射 frame 标题（INPUTS）  
- [ ] CTA disabled 来自 domain 门闸  
- [ ] 钱路径符合 [05](../05-read-write-money-path.md)  
- [ ] 用户可见文案全部 i18n；PC/H5 同 key  
- [ ] 该页门闸失败理由可测  
