# 05 — Capabilities（最小权限）

> P0：[Capabilities](https://v2.tauri.app/security/capabilities/)。  
> **超越①**：按窗最小权限；禁无审查的宽默认。

## 不变量

- Capability 定义：**哪些 window/webview** 获得 **哪些 permissions**。  
- 文件落在 `src-tauri/capabilities/`；`$schema` 指向 `gen/schemas/desktop-schema.json`（或平台 schema）。  
- **最小权限**：只授当前窗真实用到的 permission；新增插件 API 前先扩表再授。  
- 生产：在 `tauri.conf.json` → `app.security.capabilities` **显式列出**启用的 capability id（避免「目录里有什么全开」的意外面，按 P0：显式启用后仅列表生效）。

## 步骤规格（实现自写）

1. **按窗拆分**  
   - 默认 `main` → `capabilities/main.json`（见 [templates/capability.default.example.json](./templates/capability.default.example.json)）。  
   - 设置窗、预览窗等：独立 capability；**禁止**图省事 `windows: ["*"]` 除非 INPUTS 书面且 permissions 仍最小。

2. **填写 permissions**  
   - 从核心/插件权限中勾选；优先 `…:default` 子集再逐条 `allow-*`。  
   - 有 `fs` / HTTP / shell 等：必须配合 INPUTS §13 scope；禁「整个 home 可写」无理由。

3. **平台裁剪**  
   - 仅桌面插件（如 global-shortcut）加 `"platforms": ["linux","macOS","windows"]`。  
   - 本册默认 **不做** iOS/Android 移动壳；若未来扩展须另开 INPUTS。

4. **远程 API**  
   - 默认关闭 remote。若 INPUTS §10 启用：`remote.urls` 精确模式 + **最小** permissions；禁 `*` 来源。

5. **审查清单（每个 PR）**  
   - 新增 permission ↔ 有调用点？  
   - 调用点所在窗 label ∈ capability.windows？  
   - 能否删掉更宽的 default？

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 窗调用未授权 plugin API | 运行时拒绝；UI 映射 `FORBIDDEN` |
| capability 文件无效 | 构建失败 |
| 显式 capabilities 列表漏 id | 该能力不可用（fail-closed） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| main 仅 core 最小集 | 无 fs 时前端 fs API 失败 |
| 设置窗无 shell | shell 调用失败 |
| 收紧 permission 后回归 | 原合法 command 仍通；越权失败 |

## 安全边界（P0 摘要）

Capability **能**：降低前端被 XSS 后的本机面。  
Capability **不能**：修复恶意/错误 Rust、过宽 scope、command 内缺校验。校验仍在 `04`。
