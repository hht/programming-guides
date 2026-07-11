# 01 — 默认栈

> 选栈：**先进优先**；流行度仅佐证。冲突见 [sources.md](./sources.md)。

## 一句话默认栈

**Kotlin** + **Compose BOM** + **ViewModel** + **UiState `data class`**（`StateFlow`）+ **Navigation Compose** + **Coroutines + Flow**；测试 **Turbine** + **Compose UI Test**；DI **默认构造注入/简单工厂**（Hilt 可选且须在 INPUTS 写明）。

## 分层写明

| 层 | 默认 | 禁止 / 备注 |
|----|------|-------------|
| 语言 / UI | Kotlin + Jetpack Compose（BOM 对齐版本） | 禁 XML 布局作新屏默认 |
| 状态 | ViewModel + 不可变 `UiState` + `StateFlow` | **禁 LiveData 作默认** |
| 导航 | Navigation Compose | 禁手写 Activity 栈当主导航 |
| 异步 | Coroutines + Flow / StateFlow | 禁回调地狱作默认；禁主线程阻塞 IO |
| 测试 | JUnit + Turbine（Flow）+ Compose UI Test | 禁仅 Espresso 覆盖 Compose 主路径 |
| DI | 构造注入 / 简单工厂 | Hilt **仅当 INPUTS §10 勾选并书面** |
| 构建 | Gradle Kotlin DSL + Version Catalog（推荐） | 锁版本进 lock / catalog；指南不指定具体 semver 数字 |
| 网络（若有） | **OkHttp + Retrofit**（默认）；Ktor Client 仅当 INPUTS 写明迁移理由 | 禁在 Composable 里直接 `HttpURLConnection` |
| Lint / fmt | **detekt** + **ktlint** | 命令 SSOT → [kotlin Language Gate](../meta/language-gates/kotlin.md) |

语言硬门闸：[kotlin.md](../meta/language-gates/kotlin.md)（**不**在本文件复述）。

## 脚手架

| 动作 | 命令 / 产物 |
|------|-------------|
| 新工程 | Android Studio **Empty Activity (Compose)** 或 `gradle` 等价；`applicationId`=INPUTS |
| 依赖 | Compose BOM；`lifecycle-viewmodel-compose`；`navigation-compose`；`kotlinx-coroutines`；test：`turbine`、`ui-test-junit4` |
| 模块（可选） | `:app` + `:core:designsystem` + `:feature:<domain>`（词表）；单模块亦可，须仍守依赖方向（`02`） |

锁版本：实现仓 Version Catalog / lockfile；本指南约定**能力边界**，不指定具体版本号。

## 环境

见 [templates/env.example](./templates/env.example)；staging/prod **成对**（INPUTS §9）。本地可用 `local.properties` / BuildConfig 字段名与例对齐；**密钥值不入库**。
