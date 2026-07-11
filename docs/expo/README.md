# Expo — 跨端移动妥协层指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **Expo（React Native）** 应用：文件路由、可测、失焦取消 inflight。  
> **定位**：跨端移动的**妥协层**；主路径仍为原生 [apple-platforms](../apple-platforms/README.md) / [android-compose](../android-compose/README.md)。仅当 INPUTS 书面选择「单仓双端妥协」时启用本册。  
> **默认栈**：**Expo SDK 近期稳定版**（安装时以 `expo` 官方当前 stable 为准）+ **Expo Router** + **TypeScript** + **managed / 禁裸 eject 默认**；UI 状态 = 不可变 **UiState**；测试 **Jest** + **RNTL**；原生能力优先 **Expo SDK 模块**，第三方须 **Expo 兼容策略书面声明**。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用 **Expo + Expo Router + TypeScript** 交付跨端移动应用（妥协层）；**Screen State Lifecycle** 可测；主路径仍原生双端。

## 核心正确性路径

**Screen State Lifecycle**（[05](./05-screen-state-lifecycle.md)）：route focus → load → UiState → 交互 → 失焦取消。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停（须书面确认「妥协层」选型）  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. 必读 [03](./03-uistate-and-screen-model.md) + [04](./04-screen-ui-and-state-matrix.md) + [05](./05-screen-state-lifecycle.md)  
4. 落地 [06](./06-expo-router.md) + [07](./07-blur-cancel-and-native-modules.md) + [08](./08-data-layer.md)  
5. [commands.md](./commands.md) `check` 绿  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；选型/屏幕/API/环境/原生模块表 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-uistate-and-screen-model.md) | UiState 单一不可变真相 |
| [04](./04-screen-ui-and-state-matrix.md) | Screen UI + **状态矩阵** |
| [05](./05-screen-state-lifecycle.md) | **Screen State Lifecycle** |
| [06](./06-expo-router.md) | Expo Router |
| [07](./07-blur-cancel-and-native-modules.md) | 失焦取消 + 原生模块 Expo 兼容 |
| [08](./08-data-layer.md) | 数据层 / 网络 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | 矩阵 / env / scripts 例 |
