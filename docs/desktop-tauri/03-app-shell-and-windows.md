# 03 — App Shell 与窗口

## 不变量

- 桌面壳 = **Tauri 窗口 + WebView 前端**；业务 UI 在 `src/`，本机能力在 `src-tauri/`。 
- 每个窗口有稳定 **label**；capability 按 label 绑定（见 `05`）。 
- 前端默认对齐 INPUTS §3（react 册）；**四态与矩阵**：本册不重复定义组件，但 INPUTS §2b 必须勾选「应用册状态 UI 已验收」；壳层至少提供无法 invoke 时的 **error** 提示（禁静默假成功）。

## 步骤规格（实现自写）

1. **配置壳** 
 - `tauri.conf.json`：`productName`、`identifier`（= INPUTS §4）、`build.devUrl` / `frontendDist` 跟 Vite。 
 - 单窗默认 label **`main`**；尺寸/最小尺寸书面或 conf 写明。

2. **前端入口** 
 - Vite + React（或 INPUTS 约定的册）挂载；开发态 `tauri dev` 热更新。 
 - 检测 `window.__TAURI_INTERNALS__`（或官方等价）区分「纯浏览器预览」与桌面；**桌面必经**路径的按钮在非 Tauri 下禁用或提示（禁静默假成功）。

3. **多窗（若 INPUTS §12）** 
 - 每窗独立 label；打开/关闭经 command 或官方 window API（须在 capability 内）。 
 - 共享状态：默认 **Rust 侧 App 状态 + 事件/查询**；禁多窗各持一份冲突的「权威会话」除非 INPUTS 约定明。

4. **菜单 / 托盘（若 §14）** 
 - 菜单项 → **同一业务 command** 或前端 Intent（与按钮同词根）；禁用态绑定可达性状态。

5. **与 apple-platforms** 
 - 仅 Mac 且无跨端需求 → **不要**用本册替代 SwiftUI 主路径。 
 - 双交付时：词表统一；本册只负责 Tauri 壳与 IPC 边界。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 非 Tauri 环境点「本机」CTA | 明确不可用；不假装成功 |
| 未知 window label 授权 | 构建/启动失败或该 API 拒绝（fail-closed） |
| 多窗同实体编辑冲突 | INPUTS 约定：后写覆盖 / 锁 / 只读副本 — 默认**单写者** |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| conf identifier | 与 INPUTS §4 一致 |
| main label | capability `windows` 含 `main` |
| 非 Tauri 调用本机 command | UI 不进入成功态（e2e 或守卫单测） |
