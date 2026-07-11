# 00 — 原则与不变量

## 品类

用 **Expo + Expo Router + TypeScript** 交付跨端移动应用；本册是相对原生双端的**妥协层**；关键路径可测。

## 核心正确性路径（全文唯一）

**Screen State Lifecycle**：route focus → load → UiState → 交互 → 失焦取消。规格见 [05](./05-screen-state-lifecycle.md)。

## 硬不变量

1. **妥协层诚实**：未在 INPUTS §1 写明选型前，不得默认用本册替代 [apple-platforms](../apple-platforms/README.md) / [android-compose](../android-compose/README.md)。 
2. **UiState 是屏幕（或明确共享边界）的单一不可变真相**：只读渲染；禁止 Screen 内平行 `useState` / 可变 ref 当业务真相。 
3. **单向数据流**：用户/系统意图进 `onEvent`（或等价）；禁止 Screen 直接写 Repository 再绕过 UiState。 
4. **失焦必取消 inflight**（超越）：route blur / 离开焦点 → AbortController 或代次作废；旧响不得覆盖新 UiState（见 `07`）。 
5. **原生模块须声明 Expo 兼容策略**（超越）：非 Expo SDK 模块必须在 INPUTS §10 勾选兼容路径；禁止「先装再赌」。 
6. **禁裸 eject 默认**：默认 managed + EAS；定制走 CNG/`expo prebuild`（INPUTS §12），非永久丢弃 Expo 工作流。 
7. **可测**：reducer/门闸纯逻辑单测；Screen State Lifecycle 有 case→期望；关键屏 RNTL；禁「只能手点」的主路径。 
8. **本册 = Expo 交付 SSOT**：路由 / UiState / 失焦取消 / 测试门禁以本册为准；鉴权语义引用 [docs/auth](../auth/README.md)。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 选型 / 标识 / 矩阵 / 模块表 | `INPUTS.md` |
| UiState 形状与事件 | 目标仓 `features/<domain>/` + 词表 |
| Screen State Lifecycle 步骤 | `05-screen-state-lifecycle.md` |
| 失焦取消 / 原生兼容 | `07` + INPUTS §9–§10 |
| 路由文件 ↔ 业务名 | `06` + INPUTS §7 |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行业务 App / 完整 Feature 源码 
- Screen 内发网络并用本地 state 当业务真相（旁路 UiState） 
- 默认 `react-native eject` / 长期手维 `android/`+`ios/` 当唯一工作流 
- 未声明兼容策略就引入任意原生第三方 
- 把 Flutter / 裸 RN CLI 当本册默认栈 
