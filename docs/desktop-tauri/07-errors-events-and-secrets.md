# 07 — 错误、事件与密钥

## 不变量

- 对外错误 = INPUTS §8 码；serde 稳定字段（例 `code` + 可选 `message` 面向用户）。 
- **事件**（`emit` / `listen`）只用于通知/进度，**不是**写权限后门；敏感数据默认不进事件 payload。 
- 密钥与会话：若有登录，SSOT = [docs/auth](../auth/README.md)；桌面不另造「localStorage JWT 主会话」。

## 步骤规格（实现自写）

### A. 错误

1. Rust 侧统一 `AppError`（或枚举）实现 `Serialize` / `thiserror`；`#[tauri::command]` 返回 `Result<T, AppError>`。 
2. 前端 `invoke` reject → 解析 `code`；未知码 → 当 `INTERNAL` 展示。 
3. 日志可含细节；UI 文案不含绝对路径、token、堆栈。

### B. 事件（可选）

1. 仅 INPUTS 声明的事件名（业务词根，如 `library_import_progress`）。 
2. Payload 白名单字段；禁把密钥、完整文件内容默认广播。 
3. 订阅随组件卸载清理；避免泄漏。

### C. 密钥与秘密

1. 环境变量名成对（INPUTS §9）；值不入库。 
2. 需要本机密钥链时：经 **command** + capability，不经宽松前端插件默认。 
3. 禁止：把 refresh token / 私钥写入可被 XSS 读取的前端存储当主凭证。

### D. 鉴权（若适用）

1. 对接 auth 册模式；桌面第一方若用 Cookie/深链，写清与 WebView 存储边界。 
2. 未认证调用受保护 command → `FORBIDDEN` / `UNAUTHENTICATED`（码表可扩）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 序列化失败 | `INTERNAL`；不半成功 |
| 事件名未登记 | 禁止 emit（代码审查 / 测试） |
| 密钥缺失 | 启动或首调失败；明确码 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| Err(VALIDATION_FAILED) | 前端收到同码 |
| 进度事件 | 无密钥字段 |
| 无 APP 密钥配置 | 受保护 command 失败 |
