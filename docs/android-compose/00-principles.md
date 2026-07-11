# 00 — 原则与不变量

## 品类

用 **Kotlin + Jetpack Compose** 交付 Android 应用；单向数据流；关键路径可测。

## 核心正确性路径（全文唯一）

**UiState Lifecycle**：event → ViewModel/reducer → UiState → Compose 重组。规格见 [05](./05-uistate-lifecycle.md)。

## 硬不变量

1. **UiState 是屏幕（或明确共享边界）的单一不可变真相**：`data class` + 不可变集合；Compose **只读** UiState 渲染，不另持业务真相副本。  
2. **单向数据流**：用户/系统 **event** 只进 ViewModel（或纯 reducer）；禁止 Composable 直接改 Repository 再绕过 UiState 改 UI。  
3. **默认状态载体**：`StateFlow` / `MutableStateFlow`（或等价不可变快照流）暴露 UiState；**禁 LiveData 作默认**（存量迁移须书面）。  
4. **配置变更后状态不丢**：旋转/深色模式等 configuration change → ViewModel 存活恢复；须跨进程的键走 **SavedStateHandle** 或 INPUTS 声明的磁盘策略（见 `07`）。  
5. **可测**：reducer/门闸纯逻辑单测；Flow 用 Turbine；关键屏 Compose UI Test；禁「只能手点」的主路径。  
6. **本册 = Android Compose 交付 SSOT**：导航 / UiState / 测试门禁以本册为准；鉴权语义引用 [docs/auth](../auth/README.md)，不平行发明。

## SSOT 表

| 真相 | Owner |
|------|--------|
| 包名 / minSdk / DI / 矩阵 | `INPUTS.md` |
| UiState 形状与事件 | 目标仓 `features/<domain>/` + 词表 |
| UiState Lifecycle 步骤 | `05-uistate-lifecycle.md` |
| 配置变更 / SavedState 键 | `07` + INPUTS §8 |
| 导航 route / args | `06` + INPUTS §6 |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行业务 App / 完整 Feature 模块源码  
- Composable 内发网络并本地 `mutableStateOf` 当业务真相（旁路 UiState）  
- 默认栈用 LiveData / XML View 体系替代 Compose  
- 未声明 Hilt 却引入全仓 Hilt「习惯性」依赖  
