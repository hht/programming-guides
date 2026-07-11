# Desktop Tauri — 跨端桌面指南（备选路径）

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **Tauri 2** 跨端桌面：Capability 最小权限、Command 声明式 allowlist、类型化 invoke 结果。 
> **默认栈**：**Tauri 2** + **Rust** + 前端 **Vite**（默认 **React 19 + TypeScript**，与 [docs/react](../react/README.md) 对齐；INPUTS 可约定其它前端册须写明）+ **Capability** 权限模型 + `AppManifest::commands` allowlist。 
> **定位**：跨端桌面的**备选路径**；**Mac 桌面主路径仍是** [apple-platforms](../apple-platforms/README.md)（SwiftUI）。选 Tauri 须在 INPUTS §1 书面理由。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户通过 **Tauri 2** 桌面壳调用本机能力完成任务；前端只经声明过的 **command** 触达 Rust，权限按 **capability** 最小化。

## 核心正确性路径

**Command Lifecycle**（[04](./04-command-lifecycle.md)）：UI `invoke` → Rust command → 校验 → 副作用 → 类型化结果回前端。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；确认已选 Tauri（非默认走 apple-platforms Mac） 
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`） 
3. 必读 [03](./03-app-shell-and-windows.md) + [04](./04-command-lifecycle.md) + [05](./05-capabilities-least-privilege.md) + [06](./06-command-allowlist.md) 
4. 按需落地 [07](./07-errors-events-and-secrets.md) / [08](./08-packaging-and-platform-boundary.md) 
5. [commands.md](./commands.md) `check` 绿 
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者） 

## 文件树

```text
docs/desktop-tauri/
├── README.md
├── INPUTS.md
├── 00-principles.md
├── 01-stack.md
├── 02-directory-and-naming.md
├── 03-app-shell-and-windows.md
├── 04-command-lifecycle.md # Command Lifecycle（核心）
├── 05-capabilities-least-privilege.md
├── 06-command-allowlist.md
├── 07-errors-events-and-secrets.md
├── 08-packaging-and-platform-boundary.md
├── 09-testing-ci.md
├── 10-checklist.md
├── 11-world-class-acceptance.md
├── commands.md
├── sources.md
└── templates/
 ├── README.md
 ├── env.example
 ├── capability.default.example.json
 ├── command-registry.schema.json
 └── package-scripts.snippet.json
```

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；目标 OS / 前端册 / capability 表 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-app-shell-and-windows.md) | 壳、窗口、前端边界 |
| [04](./04-command-lifecycle.md) | **Command Lifecycle** |
| [05](./05-capabilities-least-privilege.md) | Capability 最小权限 |
| [06](./06-command-allowlist.md) | Command allowlist（未声明不可达） |
| [07](./07-errors-events-and-secrets.md) | 错误 / 事件 / 密钥 |
| [08](./08-packaging-and-platform-boundary.md) | 打包与 Mac 主路径边界 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | capability / registry / env 例 |
