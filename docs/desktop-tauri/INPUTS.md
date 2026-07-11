# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写 Tauri 桌面实现**。  
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL/表/P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **桌面路径选择** | □ **本册 Tauri 2（跨端备选）** — 须书面一句：为何不走 [apple-platforms](../apple-platforms/README.md) Mac 主路径（例：必须 Windows/Linux 同仓交付） |
| 2 | **目标 OS（至少勾一）** | □ macOS □ Windows □ Linux — 发版矩阵按勾选裁剪 |
| 2b | **前端 UI 交付** | 须满足：□ 设计 frame/屏清单（至少主窗）+ **loading/empty/error/success**（或书面 N/A 谓词）□ 对齐应用册 [react](../react/README.md)（或 §3 钉死的册）的状态 UI 落点与矩阵 **已勾验收** — 本册壳 + 应用册 UI **共同**构成交付；缺 UI 门闸 → 停 |
| 3 | **前端册对齐** | □ **react**（默认；Vite + React 19 + TS，见 [docs/react](../react/README.md)） □ 其它前端册（须列册名 + 映射成本；**禁止**「Vue 或 React 任选」开口） |
| 4 | **应用标识** | `identifier`（bundle id / app id）钉死；窗口 label 默认 **`main`**（多窗见 §12） |
| 5 | **Command 登记表** | 每个业务 command：`name`（snake）· 业务意图一句 · 入参类型 · 成功结果类型 · 错误码子集 · 是否写盘/网络/密钥 — 对齐 [templates/command-registry.schema.json](./templates/command-registry.schema.json) |
| 6 | **Capability 表** | 每个 capability：`identifier` · `windows[]` · `permissions[]`（最小集）· 可选 `platforms[]` — **禁止**默认给所有窗 `*` + 全插件 default |
| 7 | **Allowlist 策略** | 钉死：`build.rs` 使用 `AppManifest::commands(&[...])`（或等价）列出 §5 全部 command；未列入 → 前端 **不可** `invoke` |
| 8 | **错误码表** | 至少：`VALIDATION_FAILED` / `FORBIDDEN` / `NOT_FOUND` / `IO_FAILED` / `INTERNAL` / `COMMAND_DENIED` → 前端可映射展示（禁把 Rust panic 原文甩给用户） |
| 9 | **环境成对** | staging/prod：`APP_ENV`、（若有）API base URL、签名/更新相关密钥名；**值不入库** |
| 10 | **CSP / 远程内容** | 默认：**禁止**远程 URL 拿本地 API；若必须 `remote.urls` → 书面 URL 模式 + 最小 permissions（见 `05`） |
| 11 | **密钥与敏感面** | 哪些 command 可读密钥链/文件；默认 **禁止** 把私钥/session 明文经事件广播到前端 |
| 12 | **窗口模型** | □ 单窗 `main`（默认） □ 多窗（列 label + 各窗 capability） |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 13 | **文件系统 scope** | 任一 `fs:` / 对话框读路径 permission：钉允许根路径或 scope 模式 |
| 14 | **系统托盘 / 全局快捷键** | 勾选则 capability 单列；菜单 action → 同一 command / Intent |
| 15 | **自动更新** | 若启用：端点 URL 成对 + 公钥策略书面；否则 N/A |
| 16 | **鉴权** | 若桌面内有登录：对接 [docs/auth](../auth/README.md)；本册不另造会话 SSOT |
| 17 | **原生插件清单** | 仅列实际使用的 `@tauri-apps/plugin-*`；禁「先全装再关」 |

## 裁剪（钉死）

| 勾选 | 必读章 | 可 N/A |
|------|--------|--------|
| 全本册（默认） | 03–06；07–08 按适用 | — |
| 无事件总线 | 07 事件节 N/A | — |
| 无自动更新 | 08 更新节 N/A | — |
| 无鉴权 UI | 07 auth 节 + auth 册 N/A | — |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
