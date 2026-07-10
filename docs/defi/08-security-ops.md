# 08 — 安全与运维

## 8.1 前端安全清单

| 项 | 做法 |
|----|------|
| HTTPS | 全站；SIWE domain 才有意义 |
| CSP | 限制脚本源；禁随意 inline（按构建体系调整） |
| Clickjacking | `X-Frame-Options` / `frame-ancestors` |
| 依赖 | CI `pnpm audit` / OSV；锁版本 |
| 密钥 | 无服务端私钥进前端；WC projectId 可公开但限域 |
| XSS | 富文本/公告 HTML 消毒；默认 React 文本节点 |
| 盲签 | SIWE 用标准消息；交易前应用内解码展示 |

## 8.2 授权与钓鱼

- 展示 spender 合约名 + 地址缩写 + explorer 链接  
- 无限授权需额外确认步  
- 不在 iframe 里拉起连接/签名  
- 连接与转账入口视觉区分

## 8.3 可观测性（**仅参考**，不进世界级必勾）

若产品接入 Sentry（或等价），建议：

- 释放版本 + sourcemap  
- 过滤 `UserRejectedRequestError`  
- 面包屑：chainId、path（swap/presale）、无敏感签名  
- 告警：钱路径失败率、SIWE 失败率  

可选产品分析：连接转化、签名转化、首次 swap——**不要**把金额明文送分析。

未接入 **不**阻塞 [11](./11-world-class-acceptance.md) 验收。
## 8.4 配置与发布

- staging / prod 成对：API + 合约地址 + RPC  
- 发版笔记：合约是否变更、是否需要用户重新 approve  
- 紧急：feature flag 关闭写路径（保留只读）

## 8.5 隐私

- 日志勿打完整种子/签名  
- 支持忘记本地会话  
- Cookie 同意按司法辖区（若适用）
