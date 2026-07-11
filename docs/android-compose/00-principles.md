# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [kotlin Language Gate](../meta/language-gates/kotlin.md)。本文件只含 **Jetpack Compose 框架 MUST**。

## 品类

用 **Kotlin + Jetpack Compose** 交付 Android 应用；单向数据流；关键路径可测。

## 核心正确性路径（全文唯一）

**UiState Lifecycle**：event → ViewModel/reducer → UiState → Compose 重组。规格见 [05](./05-uistate-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | UiState 是屏幕（或明确共享边界）的单一不可变真相（`data class` + 不可变集合） | `05` / 单测 |
| F02 | MUST | Compose **只读** UiState 渲染，不另持业务真相副本 | 代码抽检 |
| F03 | MUST | 用户/系统 event 只进 ViewModel（或纯 reducer） | `05` |
| F04 | MUST NOT | Composable 直接改 Repository 再绕过 UiState 改 UI | 同上 |
| F05 | MUST | 默认用 `StateFlow` / `MutableStateFlow`（或等价）暴露 UiState | `01` / 抽检 |
| F06 | MUST NOT | 以 LiveData 作默认状态载体（存量迁移须写明） | 同上 |
| F07 | MUST | 配置变更后状态不丢（ViewModel 存活；跨进程键走 SavedStateHandle 或 INPUTS 策略） | `07` |
| F08 | MUST | reducer/门闸可单测；Flow 用 Turbine；关键屏 Compose UI Test | `09` |
| F09 | MUST NOT | 「只能手点」作为主路径唯一验收 | `09` / `11` |
| F10 | MUST | 本册为 Android Compose 交付 SSOT；鉴权引用 auth 册 | 边界抽检 |

## SSOT 表

| 真相 | Owner |
|------|--------|
| 包名 / minSdk / DI / 矩阵 | `INPUTS.md` |
| UiState 形状与事件 | 目标仓 `features/<domain>/` + 词表 |
| UiState Lifecycle 步骤 | `05-uistate-lifecycle.md` |
| 配置变更 / SavedState 键 | `07` + INPUTS §8 |
| 导航 route / args | `06` + INPUTS §6 |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止（摘要）

- 指南仓堆可运行业务 App  
- 默认 XML View 体系替代 Compose  
- 未声明却全仓引入 Hilt「习惯性」依赖  
