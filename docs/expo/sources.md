# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| Expo Docs（最新 stable SDK） | https://docs.expo.dev/ |
| Expo Router | https://docs.expo.dev/router/introduction/ |
| Create Expo App / Workflow | https://docs.expo.dev/get-started/create-a-project/ |
| EAS Build / CNG（prebuild） | https://docs.expo.dev/workflow/overview/ |
| React Native (官方) | https://reactnative.dev/ |

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [expo/expo](https://github.com/expo/expo) | P1 | SDK 模块边界、Router、工具链、工作流 | 把 monorepo 内部包结构当业务词表 | Expo 平台与 SDK 真相源 |
| B | [expo/examples](https://github.com/expo/examples) | P1 | 官方示例：Router、模块用法、项目骨架 | 示例目录名当 Pass1 词表；demo 可缺严谨 Lifecycle | Expo 可运行示例集 |
| C | [facebook/react-native](https://github.com/facebook/react-native) | P1 | 运行时原语、组件模型、升级约束 | 裸 CLI eject 工作流当本册默认 | RN 运行时与跨端基础 |

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 移动屏可导航使用（路由） | ✓ | ✓ | ✓/映射 | 必做（本册钉 Expo Router；吞并「有屏幕 UI」） |
| 屏四态 loading/empty/error/success | ✓/映射 | ✓ | ✓/映射 | 必做 |
| 调用设备能力（相机/通知等） | ✓ | ✓ | ✓ | 条件必做（INPUTS 声明模块时） |
| 登录/会话门闸 | 视样本 | 视样本 | — | 条件：INPUTS §6 |

> 上表与 `11`§B 行一一对齐。  
> TypeScript / Managed / 可测 / UiState 形状 → **工程面 §1.2**（`01`/`09`/`11`§A），不作功能共有。  
> 「失焦取消 inflight」「原生模块 Expo 兼容书面策略」→ **仅超越**（差距表 + `11`§C a1/a2），**不进本表**。

## 差距表

| 缺口 | 来自标杆 | 类型 | 落入文件 | 必做/可选/参考 |
|------|----------|------|----------|----------------|
| Expo Router 文件路由 | A,B + P0 | 功能/工程 | `06` | 必做 |
| UiState 单向流 | 工程先进 + 映射 Compose 册 | 工程 | `03`、`05` | 必做 |
| 屏幕四态 + 状态矩阵 | 工程纪律 | 功能/工程 | `04` + templates | 必做 |
| Screen State Lifecycle | 本册核心 | 功能/工程 | `05` | 必做 |
| 失焦取消 inflight | 超越 vs A/B/C | 工程/超越 | `07`、`05` | 必做/超越 |
| 原生模块 Expo 兼容策略表 | 超越 vs A/B | 工程/超越 | `07`、INPUTS | 必做/超越 |
| Managed / 禁裸 eject 默认 | A,B + P0 | 工程 | `01`、INPUTS §12 | 必做 |
| Repository + AbortSignal | 工程 | 工程 | `08` | 必做 |
| Jest + RNTL + 发版矩阵 | A,C | 工程 | `09` | 必做 |
| SecureStore 会话 | P0 Expo | 安全 | INPUTS §6、`08` | 条件必做 |
| NativeWind / 重型 UI 库 | 流行可选 | 工程 | `01` | 可选（须 INPUTS） |
| 可观测/Sentry 类 | — | 参考 | — | 参考；**不进必勾** |

## 冲突记录

| 冲突 | 裁决 |
|------|------|
| 裸 React Native CLI / eject 在 C 与部分教程很常见 vs Expo managed | **默认 managed + EAS/CNG**；禁裸 eject 默认（先进工作流 + P0 Expo；流行度不压过） |
| 自建 React Navigation 根容器 vs Expo Router | **钉 Expo Router**（与当前 Expo 主推对齐；先进文件路由 + 类型化 params） |
| Redux/MobX 在 RN 历史流行 vs 屏级不可变 UiState | **默认屏级 UiState + onEvent**；全局库仅 INPUTS 书面 |
| NativeWind / Paper 等 UI 库 | **不进默认栈**；需则 INPUTS 书面（避免第二套样式/组件 SSOT） |
| 用 Expo 替代原生双端主路径 | **否**：本册 = 妥协层；须 INPUTS §1；主路径仍 apple-platforms / android-compose |
| 标杆示例弱 Lifecycle | 示例可学骨架；**Lifecycle / 失焦取消以本册为准**（超越） |
