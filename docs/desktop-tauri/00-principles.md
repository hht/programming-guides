# 00 — 原则与不变量

## 品类

用户通过 **Tauri 2** 桌面壳调用本机能力完成任务；前端只经声明过的 **command** 触达 Rust，权限按 **capability** 最小化。  
**Mac 主路径**仍是 [apple-platforms](../apple-platforms/README.md)；本册为跨端备选。

## 核心正确性路径（全文唯一）

**Command Lifecycle**：UI `invoke(name, args)` → Rust `#[tauri::command]` → **校验** → **副作用** → **类型化** `Ok(T)` / `Err(Code)` 回前端。规格见 [04](./04-command-lifecycle.md)。

## 硬不变量

1. **Tauri 2**（非 v1 API 默认）；Rust edition 与脚手架跟官方 create-tauri-app 当前线。  
2. **前端不可直达本机**：文件/进程/密钥等只经 command 或已授权 plugin API；禁「前端随便读盘」。  
3. **Capability 最小权限**：每窗只授需要的 `permissions`；禁生产默认 `windows: ["*"]` + 宽插件 default 无审查（见 `05`）。  
4. **Command allowlist**：`AppManifest::commands`（或 P0 等价）列出全部业务 command；**未声明 → 前端不可达**（见 `06`）。  
5. **Command Lifecycle 唯一入口**：业务写操作不绕开 `04` 另开平行 IPC。  
6. **错误类型化**：对外 `Result<T, AppError>`（或等价）；`AppError` 映射 INPUTS §8 码；禁裸 `String` 当长期契约。  
7. **密钥**：敏感值不进前端 localStorage 当主会话；不经宽松 event 广播（见 `07`）。  
8. **deletion-first**：无第二套「桌面专用业务层」与前端领域逻辑分叉；跨端差异限壳/capability/打包。

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

## 禁止

- 指南仓堆可运行业务桌面 App  
- 把 Electron 当本册默认栈  
- 生产关闭 capability / 全权限「先跑起来再说」  
- 未列入 allowlist 仍依赖「默认全开 command」  
- 自有产品仓当唯一标杆  

## 超越（对照写入 11）

1. `对照：B 中更弱/未见「按窗 capability 最小权限硬门闸」→ 本指南要求每窗显式 permissions，禁无审查的 * + 宽 default（见 05）`  
2. `对照：B 中更弱/未见「未声明 command 前端不可达」硬门闸 → 本指南要求 AppManifest::commands allowlist，未列入则 invoke 失败（见 06）`  
