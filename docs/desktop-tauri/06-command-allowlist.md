# 06 — Command Allowlist（未声明不可达）

> P0：Capabilities 文档中的 [AppManifest::commands](https://v2.tauri.app/security/capabilities/) 说明。  
> **超越②**：前端不可达未声明 command。

## 不变量

- 默认（未收紧时）注册到 `invoke_handler` 的 command 可能对所有窗可用 — **本指南禁止依赖该宽松默认做生产**。  
- 必须在 `build.rs`（或 P0 当前等价 API）用 **`AppManifest::commands(&["…"])`** 列出 INPUTS §5 **全部**业务 command。  
- **未列入表的名字**：前端 `invoke` **失败**；即便误写 `generate_handler!` 多注册，也不对前端暴露。  
- 登记表（JSON/Schema）与 `commands(&[…])` 与 `generate_handler!` **三处同源**：改一名须改三处（可用测试/脚本校验，指南不附业务脚本实现）。

## 步骤规格（实现自写）

1. **维护登记表**  
   - 形状见 [templates/command-registry.schema.json](./templates/command-registry.schema.json)。  
   - 每行：`name`、意图、读写级别、错误码子集。

2. **build.rs allowlist**  
   ```rust
   // 规格级示例（非业务实现）
   tauri_build::try_build(
     tauri_build::Attributes::new().app_manifest(
       tauri_build::AppManifest::new().commands(&[
         "open_library",
         "export_report",
         // … ≡ INPUTS §5
       ]),
     ),
   )?;
   ```

3. **generate_handler!**  
   - 仅包含登记表中的函数；禁止「先全挂上再靠文档不调用」。

4. **前端**  
   - 只允许从生成的常量/枚举取 command 名（或手写常量单文件）；禁魔法字符串分叉。

5. **门闸**  
   - CI：登记表 ⊆ allowlist ⊆ handler（集合相等）。不等 → `check` 非 0。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| invoke 未声明名 | `COMMAND_DENIED` / 框架拒绝；无副作用 |
| 表有、handler 无 | 构建或启动失败 / invoke 失败 |
| handler 有、表无 | **CI 红**（禁止合并） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 声明内合法 command | Lifecycle 走通 |
| 随机字符串 command | 失败；副作用 0 |
| 故意从 allowlist 删除仍留 handler | CI 集合校验红；或运行时前端不可达 |
