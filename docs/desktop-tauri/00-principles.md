# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [rust Language Gate](../meta/language-gates/rust.md) + [typescript Language Gate](../meta/language-gates/typescript.md)（双语言各跑门闸）。  
> 前端默认 React → 框架习惯链 [react/00](../react/00-principles.md)；**Mac 原生主路径**仍是 [apple-platforms](../apple-platforms/README.md)。

## 品类

用户通过 **Tauri 2** 桌面壳调用本机能力；前端只经声明过的 **command** 触达 Rust，权限按 **capability** 最小化。

## 核心正确性路径（全文唯一）

**Command Lifecycle**：UI `invoke(name, args)` → Rust `#[tauri::command]` → **校验** → **副作用** → **类型化** `Ok(T)` / `Err(Code)`。规格见 [04](./04-command-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 使用 Tauri 2（非 v1 API 默认） | `01` / 依赖抽检 |
| F02 | MUST NOT | 前端直达本机文件/进程/密钥（须经 command 或已授权 plugin） | `04` / 安全抽检 |
| F03 | MUST | 每窗 capability 最小权限；显式 `permissions` | `05` |
| F04 | MUST NOT | 生产默认 `windows: ["*"]` + 宽插件 default 无审查 | `05` |
| F05 | MUST | `AppManifest::commands`（或 P0 等价）列出全部业务 command | `06` |
| F06 | MUST | 未声明 command → 前端不可达 | `06` / 单测 |
| F07 | MUST | 业务写操作不绕开 Command Lifecycle | `04` |
| F08 | MUST | 对外 `Result<T, AppError>`（或等价）映射 INPUTS 错误码 | `04` / `09` |
| F09 | MUST NOT | 裸 `String` 当长期错误契约 | 同上 |
| F10 | MUST NOT | 敏感值进前端 localStorage 当主会话 / 经宽松 event 广播 | `07` |
| F11 | MUST | deletion-first；无第二套桌面专用业务层与前端领域分叉 | 目录抽检 |

## SSOT 表

| 真相 | Owner |
|------|--------|
| 目标 OS / command 表 / capability 表 / allowlist | `INPUTS.md` |
| Command Lifecycle 步骤 | `04-command-lifecycle.md` |
| Capability 最小权限规则 | `05-capabilities-least-privilege.md` |
| Command 声明与未声明拒绝 | `06-command-allowlist.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |
| Mac 原生桌面（主路径） | [apple-platforms](../apple-platforms/README.md) |
| 前端路由/Mutation（默认 React） | [docs/react](../react/README.md)（INPUTS §3） |
| 鉴权语义（若有） | [docs/auth](../auth/README.md) |

## 禁止（摘要）

- Electron 当本册默认栈  
- 生产关闭 capability / 全权限「先跑起来」  
