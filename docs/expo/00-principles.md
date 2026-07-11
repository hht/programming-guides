# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [typescript Language Gate](../meta/language-gates/typescript.md)。  
> React 客户端重叠习惯 → 可链 [react/00](../react/00-principles.md)；**本册 SSOT** 仍是 Expo Screen State。

## 品类

用 **Expo + Expo Router + TypeScript** 交付跨端移动应用；相对原生双端的**妥协层**；关键路径可测。

## 核心正确性路径（全文唯一）

**Screen State Lifecycle**：route focus → load → UiState → 交互 → 失焦取消。规格见 [05](./05-screen-state-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | INPUTS §1 写明妥协层选型后，才可用本册替代原生双端册 | INPUTS 门闸 |
| F02 | MUST | UiState 是屏幕（或共享边界）单一不可变真相；只读渲染 | `05` |
| F03 | MUST NOT | Screen 内平行 `useState` / 可变 ref 当业务真相 | 代码抽检 |
| F04 | MUST | 意图进 `onEvent`（或等价）；单向数据流 | `05` |
| F05 | MUST NOT | Screen 直接写 Repository 绕过 UiState | 同上 |
| F06 | MUST | route blur / 失焦取消 inflight（AbortController 或代次） | `07` / 单测 |
| F07 | MUST | 非 Expo SDK 原生模块在 INPUTS §10 声明兼容策略 | INPUTS |
| F08 | MUST NOT | 默认永久 `eject` / 手维 `android/`+`ios/` 当唯一工作流 | `01` / INPUTS §12 |
| F09 | MUST | reducer/Lifecycle 可单测；关键屏 RNTL | `09` |
| F10 | MUST | 本册为 Expo 交付 SSOT；鉴权引用 auth 册 | 边界 |

## SSOT 表

| 真相 | Owner |
|------|--------|
| 选型 / 标识 / 矩阵 / 模块表 | `INPUTS.md` |
| UiState 形状与事件 | 目标仓 `features/<domain>/` + 词表 |
| Screen State Lifecycle 步骤 | `05-screen-state-lifecycle.md` |
| 失焦取消 / 原生兼容 | `07` + INPUTS §9–§10 |
| 路由文件 ↔ 业务名 | `06` + INPUTS §7 |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止（摘要）

- 指南仓堆可运行业务 App  
- 把 Flutter / 裸 RN CLI 当本册默认栈  
