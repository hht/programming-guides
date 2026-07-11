# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
# 实现仓建议落点（create-tauri-app 可微调；词根不变）
src/ # Vite 前端（默认 React；features/ 业务词根）
 features/<capability>/ # 例 library/ · sync/ — invoke 客户端落此
 shared/ # 纯 UI/工具；禁藏未登记 command 名
src-tauri/
 Cargo.toml
 tauri.conf.json
 build.rs # AppManifest::commands allowlist
 capabilities/
 main.json # 按窗；最小 permissions（见 05）
 src/
 lib.rs # Builder + generate_handler!
 commands/ # 按业务分模：library.rs — 非 *Manager
 mod.rs
 error.rs # AppError ↔ INPUTS 错误码
 domain/ # 可选：纯 Rust 领域（无 IPC）
UBIQUITOUS_LANGUAGE.md
INPUTS.md # 或 docs 侧填写本指南 INPUTS 副本
```

依赖方向：

```text
UI (features) → invoke 客户端（薄） → Rust commands → domain / OS APIs
```

**禁** UI 直接 `fs` 插件乱调而未进 capability；**禁** `commands/` 再包一层无业务名的 `*Service`/`*Manager` 套壳。

与 [apple-platforms](../apple-platforms/README.md)：若同产品双路径，**业务词表同一份**；壳差异不得分叉实体名。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **Command 名、窗口业务含义、capability identifier** = 业务操作/实体词根（`open_library`、`import_asset`），禁 `do_stuff`、`handle_ipc`、`process_data`。 
3. **禁**技术翻译名进领域：`*Dto`、`*Manager`、`*Service`、`handle*`（IPC 薄适配可用 `invokeOpenLibrary`，词根仍是业务）。 
4. **禁**同义词分叉：`invoke` 路径与菜单/托盘 action 同一业务操作名。 
5. 对外错误码、command 字符串冻结在词表；改名=契约变更。

| 概念 | 正例 | 反例 |
|------|------|------|
| Command | `open_library`、`export_report` | `handle_file`、`do_cmd1` |
| Capability id | `main-window`、`settings-window` | `cap1`、`full-access` |
| 窗口 label | `main`、`settings` | `win`、`webview1` |
| 错误码 | `VALIDATION_FAILED`、`IO_FAILED` | `ERR1`、`fail_generic` |
| 前端函数 | `openLibrary` | `callRust`、`processInvoke` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| Rust command 函数 / invoke 名 | `snake_case`（Tauri 默认；前端 invoke 字符串同名） |
| 前端 TS 包装 | `camelCase` 函数；内部字符串仍为 command `snake_case` |
| Capability / permission 标识 | 跟 Tauri：`kebab` / `plugin:allow-*` 官方形 |
| 窗口 label | `kebab` 或短 `main`；与 capability `windows[]` 一致 |
| 环境变量 | `SCREAMING_SNAKE`（`APP_ENV`） |
