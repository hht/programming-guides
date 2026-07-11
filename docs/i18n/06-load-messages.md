# 06 — Load Messages

## 不变量

- 仅加载 **步骤 1 已解析** 的 `resolvedLocale`（及 INPUTS 写明允许的 fallback 文件策略）。 
- 消息来自 `03` SSOT 路径；禁止运行时从随意 CDN 覆盖仓库 SSOT 而不经版本发布。 
- Next RSC：首屏消息在 **服务端** 按请求 locale 注入；禁止首屏先闪默认 locale 再客户端替换（hydration 文案不一致）。

## 步骤规格（实现自写）

1. **定位文件**：`messages/{locale}.json` 或分片 `messages/{locale}/**/*.json`。 
2. **加载方式（按宿主）**： 

| 宿主 | 默认 |
|------|------|
| Next + `next-intl` | 服务端 `getRequestConfig` / 等价按 locale `import`；客户端导航继续同一契约 |
| Vite SPA + `react-intl` | 静态 `import` 默认 locale；其它 locale **dynamic import()**（或全量打包若 locale≤3 且体积预算允许——INPUTS 约定） |

3. **分片合并**：若分片，按 namespace 合并为运行时一张表（或库的 namespace API）；合并后 key 冲突 → **构建失败**。 
4. **缓存**：同一请求 / 同一会话内同一 locale 不重复网络拉取；locale 切换 → 加载目标 locale（可保留旧 messages 仅用于过渡骨架，**不得**标记为新 locale ready）。 
5. **失败**：解析错误、模块 404、超时 → `i18n.messages_load_failed`。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 动态 import 失败 | load_failed；可重试一次（INPUTS；默认 **1**） |
| 分片缺文件 | 同 load_failed（默认不静默跳过缺分片） |
| 体积过大 | 分片；预算数字须写明（可选性能） |
| 用错误 locale 的 messages | **禁止**；测试红灯 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| en.json 可加载 | messages 非空 |
| 切换 zh-CN | 加载 zh-CN；ready 后 t 为中文 |
| 损坏 JSON | load_failed |
| 首屏 locale=zh-CN（Next） | HTML 含中文关键串；非先 en 后闪 |
