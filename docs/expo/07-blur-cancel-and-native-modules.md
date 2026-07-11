# 07 — 失焦取消与原生模块 Expo 兼容（超越）

> 超越对照见 [11](./11-world-class-acceptance.md) §C a1 / a2。 
> a1 = 失焦取消 inflight；a2 = 原生模块须声明 Expo 兼容策略。

## 不变量

- 凡 INPUTS §9 勾选「须取消」的屏：blur / 卸载 **必须** abort 或作废代次；`ABORTED` ≠ 用户可见 error。 
- 凡非 Expo SDK 自带的原生依赖：必须出现在 INPUTS §10，并勾选兼容策略之一；未声明 → **禁止合并**。 
- 默认工作流仍 managed / CNG（`01`）；引入需自定义原生代码的库时，兼容策略必须说明是否仍可用 EAS + config plugin。

## A. 失焦取消 — 步骤规格

1. **令牌** 
 - 每轮 load：`AbortController` **或** 单调 `generation`（二选一写明在实现仓；可组合）。 
2. **挂载取消** 
 - 在 focus effect 的 cleanup / blur 回调调用 `abort()` 或 `generation++`。 
3. **写回门闸** 
 ```text
 if (signal.aborted || gen !== currentGeneration) return // 不 setState
 ``` 
4. **竞态** 
 - 快速切换详情 id：params 变化 = 取消旧轮 + 新轮 load。 
5. **测试** 
 - 单测：mock Repository 延迟 resolve；blur 后 resolve → 断言 UiState 未被旧数据覆盖。

## B. 原生模块 Expo 兼容 — 步骤规格

1. **优先 Expo SDK** 
 - 同等能力优先 `expo-*` 官方模块（SecureStore、Camera、Notifications…）。 
2. **第三方准入（INPUTS §10 行）** 
 | 策略 | 何时允许 | 验收谓词 |
 |------|----------|----------|
 | Expo 官方兼容 / 文档标明支持当前 SDK | 库 README/Expo 文档明示 | URL + 目标 SDK 大版本 |
 | Config plugin + EAS 构建验证 | 需原生配置 | plugin 名；CI/本地 `eas build` 或 prebuild 成功记录 |
 | 禁止引入 | 无兼容路径 / 逼迫永久 eject | 不得进 dependencies |
3. **审查** 
 - PR 检查：`package.json` 新增含原生代码的依赖 → 必须对照 §10 表有行。 
4. **与 eject** 
 - 兼容策略 **不得** 默认为「eject 后手维 android/ios」；若产品强制，须改 INPUTS §12 并书面接受失 Expo 默认工作流（本指南视作例外，非默认）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| abort 后抛错 | 吞为 `ABORTED`；不打 error UI |
| §10 缺行却引入原生库 | `INPUTS BLOCKED` / PR 拒 |
| Config plugin 与当前 SDK 不兼容 | 换 Expo 模块、降级策略或禁止 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| blur 后晚到 success | UiState 保持 blur 前；非被覆盖 |
| id 连切 A→B | 仅 B 的数据在 success |
| AbortError | 不进入 `error` phase |
| §10 表示例行存在 | 实现仓文档/INPUTS 可核对（清单测） |
