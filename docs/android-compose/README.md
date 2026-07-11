# Android Compose — Kotlin + Jetpack Compose 指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **Kotlin + Jetpack Compose** Android 应用：单向数据流、可测、配置变更后状态不丢。  
> **默认栈**：**Kotlin** + **Compose BOM**（先进）+ **ViewModel** + **UiState `data class`**（禁 LiveData 作默认）+ **Navigation Compose** + **Coroutines + Flow**；测试 **Turbine** + **Compose UI Test**；DI **可选**（默认构造注入/简单工厂；若用 Hilt 须书面写入 INPUTS）。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用 **Kotlin + Jetpack Compose** 交付 Android 应用；单向数据流；关键路径可测。

## 核心正确性路径

**UiState Lifecycle**（[05](./05-uistate-lifecycle.md)）：event → ViewModel/reducer → UiState → Compose 重组。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. 必读 [03](./03-uistate-and-viewmodel.md) + [04](./04-compose-ui-and-state-matrix.md) + [05](./05-uistate-lifecycle.md)  
4. 落地 [06](./06-navigation-compose.md) + [07](./07-config-change-and-savedstate.md) + [08](./08-data-layer-and-flow.md)  
5. [commands.md](./commands.md) `check` 绿  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；包名/屏幕/API/环境 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-uistate-and-viewmodel.md) | UiState 单一不可变真相 |
| [04](./04-compose-ui-and-state-matrix.md) | Compose UI + **状态矩阵** |
| [05](./05-uistate-lifecycle.md) | **UiState Lifecycle** |
| [06](./06-navigation-compose.md) | Navigation Compose |
| [07](./07-config-change-and-savedstate.md) | 配置变更 / SavedState |
| [08](./08-data-layer-and-flow.md) | 数据层 + Flow |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | 矩阵 / env 例 |
