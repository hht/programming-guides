# 03 — Targets 与 App 壳

## 不变量

- 一个产品 **一个** Multiplatform（或共享 SPM）代码基；iPhone / iPad / Mac 差异用条件编译或文件归属，不复制整棵 Features。 
- `@main` App 入口保持薄：注入根 Store / 环境依赖，不写业务规则。 
- 最低版本与目标平台以 INPUTS §1–§2 为准。

## 步骤规格（实现自写）

1. **建工程**：Xcode Multiplatform App（或 iOS App + macOS App 共享 SPM 库）。Scheme 名写入 INPUTS §13。 
2. **Target membership**：`Features/`、`Shared/`、`Navigation/` 进共享；`Mac/` 仅 macOS target。 
3. **App 壳**：根 `WindowGroup`（Mac 见 `08`）+ 根导航（`06`）+ 可选 `TabView`。 
4. **依赖注入**：API client、时钟、钥匙串包装以协议注入 Store（便于单测）；禁单例散落读全局。 
5. **配置**：`API_BASE_URL` 等来自 xcconfig / Info 键（[templates/xcconfig.example](./templates/xcconfig.example)）；禁硬编码 prod URL 在源码。 
6. **能力开关**：推送、后台等仅在 INPUTS §14+ 勾选时打开 Entitlements。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| INPUTS 未勾 Mac 却提交 Mac/`08` 相关菜单 | 不允许；或补齐 INPUTS §11 |
| 仅 iOS 目标 | `Mac/` 目录可省略；报告 `08 N/A` |
| Catalyst 提案 | **拒绝**作默认；须用户在 INPUTS 中写明变更 并接受非本册默认 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| App 启动（测根装配可测部分） | 根 Store 可注入 fake client；无网络在 `init` 必发 |
| xcconfig staging | `API_BASE_URL` 指向 staging 主机名（字符串断言或集成） |
