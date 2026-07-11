# 04 — Command Lifecycle（核心）

> **全文唯一核心正确性路径。**  
> UI `invoke` → Rust command → 校验 → 副作用 → 类型化结果回前端。

## 不变量

- 凡本机副作用（读盘、写盘、启进程、改系统设置、碰密钥）**必须**经本生命周期。  
- 校验失败 → **不**执行副作用；返回 `VALIDATION_FAILED`（或 INPUTS 子集）。  
- 成功/失败均类型化；禁止「resolve 了但 UI 当成功」的假成功。  
- Command 须同时满足：`generate_handler!` 注册 **且** allowlist 声明（`06`）**且** 调用窗具备所需 capability（`05`）。

## 步骤规格（编号钉死）

| # | 步骤 | 规格 |
|---|------|------|
| 1 | **UI invoke** | 前端仅通过薄包装调用 `invoke('<snake_name>', { … })`；参数键 **camelCase**（serde 默认）；名称 ∈ INPUTS §5 登记表。禁止字符串散落无登记。 |
| 2 | **到达 Rust command** | `#[tauri::command]`（可 `async`）；未在 allowlist → **拒绝**（`COMMAND_DENIED` 或框架等价），不进入校验后逻辑。 |
| 3 | **校验** | 反序列化后：必填字段、范围、路径是否落在 INPUTS scope、主体是否允许（若有 auth）。失败 → `Err(VALIDATION_FAILED|FORBIDDEN|…)`，**零副作用**。 |
| 4 | **副作用** | 唯一允许产生本机/网络副作用的步骤；幂等策略按业务钉（默认：重复 invoke 不破坏不变量或返回明确冲突码）。 |
| 5 | **类型化结果** | `Ok(T)` 且 `T: Serialize`；`Err(E)` 映射 INPUTS §8。大二进制用 P0 `ipc::Response` 等，不把巨型 JSON 当默认。 |
| 6 | **前端收束** | Promise resolve → 更新 UI/缓存（对齐 react Mutation 习惯）；reject → 映射错误码展示；**禁止** catch 后当作成功。 |

## 伪代码（非实现）

```text
lifecycle(name, args, window):
  if name ∉ allowlist → Err(COMMAND_DENIED)
  if !capability_allows(window, name_or_plugin) → Err(FORBIDDEN)  // 框架/配置层
  cmd = resolve(name)
  input = deserialize(args)           // fail → VALIDATION_FAILED
  validate(input, scopes, subject)    // fail → 码；no side effects
  result = execute(input)             // side effects only here
  return serialize(Ok(result)) | map(Err)
```

## 失败分类 / 默认值

| 类 | 条件 | 行为 |
|----|------|------|
| `COMMAND_DENIED` | 未声明 / 不允许 | 无副作用；前端错误态 |
| `VALIDATION_FAILED` | 入参不合法 | 无副作用 |
| `FORBIDDEN` | 鉴权/capability/scope | 无副作用 |
| `NOT_FOUND` | 业务实体不存在 | — |
| `IO_FAILED` | 本机 IO 失败 | 可重试策略书面 |
| `INTERNAL` | 非预期 | 不泄露内部路径/密钥 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 合法入参 | `Ok`；副作用发生 1 次 |
| 缺必填字段 | `VALIDATION_FAILED`；副作用 0 次 |
| 未登记 command 名 | 前端 invoke 失败；副作用 0 |
| 副作用中 IO 错 | `IO_FAILED`；不伪装 Ok |
| 校验失败后再 invoke 成功 | 第二次 Ok；状态一致 |
