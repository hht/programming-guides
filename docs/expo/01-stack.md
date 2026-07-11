# 01 — 默认栈

> 选栈：**先进优先**；流行度仅佐证。冲突见 [sources.md](./sources.md)。

## 一句话默认栈

**Expo SDK 近期稳定版**（以官方当前 stable 为准，用 `npx expo install` 对齐）+ **Expo Router** + **TypeScript** + **不可变 UiState** + **managed（禁裸 eject 默认）**；测试 **Jest** + **React Native Testing Library**；原生优先 **Expo SDK 模块**。

## 分层写明

| 层 | 默认 | 禁止 / 备注 |
|----|------|-------------|
| 运行时 | Expo SDK（stable）+ React Native（SDK 绑定版本） | 禁绕过 Expo 约定任意 RN 版本 |
| 语言 | TypeScript strict | 禁默认 JS 无类型业务屏 |
| 路由 | **Expo Router**（文件路由） | 禁手写 React Navigation 容器作默认主导航（Router 内建即可） |
| 状态 | 不可变 `UiState` + `onEvent`；屏级 hook/store | 禁 Redux/MobX「习惯性」默认；若用须在 INPUTS 写明 |
| 样式 | StyleSheet / 项目已有 token；可选 NativeWind **仅当 INPUTS 写明** | 禁未声明的第二套样式体系 |
| 原生能力 | Expo SDK 模块（Camera、SecureStore…） | 第三方：INPUTS §10 兼容策略 |
| 构建 | EAS Build + `expo prebuild`（CNG） | **禁裸 eject 默认** |
| 测试 | Jest + RNTL；发版可用 Maestro/Detox（INPUTS 择一写明） | 禁仅手动冒烟作主路径 |
| 包管理 | pnpm 或 npm（实现仓选定一种 + lockfile） | 锁版本；`expo install` 对齐 peer |

## 脚手架

| 动作 | 命令 / 产物 |
|------|-------------|
| 新工程 | `npx create-expo-app@latest`（TypeScript 模板）或官方 `tabs` / Router 模板；`slug`=INPUTS |
| 对齐依赖 | `npx expo install <pkg>`（勿裸 `npm i` 装 SDK 对等包） |
| 路由 | 启用 `expo-router` 入口（`main` → `expo-router/entry`）；`app/` 目录 |
| 医生 | `npx expo-doctor` 进 `check` 建议项 |
| 构建 | EAS：`eas build`；本地 dev：`npx expo start` |

锁版本：实现仓 lockfile；本指南约定**能力边界**，不指定具体 semver 数字（安装时跟官方 stable）。

## 环境

见 [templates/env.example](./templates/env.example)；staging/prod **成对**（INPUTS §11）。可用 `expo-constants` / `app.config` 读公开配置；**密钥值不入库**。
