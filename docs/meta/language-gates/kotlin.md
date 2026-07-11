# Kotlin — Language Gate

> Normative: MUST / MUST NOT（RFC 2119；DO / DO NOT 同义，本文件统一用 MUST）

## 适用范围

- 应用册：[kotlin-backend](../../kotlin-backend/README.md)
- **MUST NOT** 把 Compose / Android UI Lifecycle 写入本闸（属 android-compose 等应用册）

## 最高准则映射（必填）

| 准则 | 本语言如何落实（≤5 条硬门闸 ID） |
|------|----------------------------------|
| 极简 | G01, G02 |
| 清晰可测 | G03, G04, G05, G07 |
| 算法精妙 | G06 |

## Formatter / Linter（仆人；互斥任选）

| 角色 | 工具 | 命令字符串 | 配置落点 |
|------|------|------------|----------|
| fmt | ktlint（via Gradle） | `./gradlew ktlintCheck` | 根 `build.gradle.kts` / ktlint 插件 |
| lint | detekt | `./gradlew detekt` | `detekt.yml` |

挂靠册可将二者合并为 `./gradlew detekt ktlintCheck`（kotlin-backend 现状），子命令须与上表工具一致且可拆验。

## 硬门闸

| ID | 归属准则 | 关键词 | 规约 | 探针 |
|----|----------|--------|------|------|
| G01 | 极简 | MUST NOT | 保留未使用的声明或死代码 | detekt / 编译器 unused |
| G02 | 极简 | MUST NOT | 无必要的 `*Manager`/`*Helper` 空壳层（D2） | 评审删层 |
| G03 | 清晰可测 | MUST | 可空性在类型系统表达；**MUST NOT** 滥用 `!!` 作为默认逃逸 | detekt `UnsafeCallOnNullableType` 或等价 |
| G04 | 清晰可测 | MUST | 领域失败用类型化结果（Result/密封类/错误码）；禁止未映射异常直出 API | 单测 case→期望 |
| G05 | 清晰可测 | MUST | 领域逻辑可 `./gradlew test`；禁止假成功 | case→期望 |
| G06 | 算法精妙 | SHOULD | 热路径选充分简单算法；偏离写明 | 注释/基准 + 探针 |
| G07 | 清晰可测 | MUST | 公开 API 悬空类型可空性在签名表达；**MUST NOT** 返回平台类型却文档写「永不为 null」无探针 | 单测 / 签名抽检 |

## 命名边界

- Pass1/Pass2 → 应用册 `02`；本文件不写大小写表

## 证据与冲突

| 来源 | 采用? | why（相对 §0） |
|------|-------|----------------|
| Kotlin 官方 coding conventions（可机械部分） | 部分 | 仆人；不整书 |
| detekt / ktlint | 是 | 可机械检查 |
| Google Kotlin Style | 部分 | 不整书；冲突取 §0 |

## 接入检查

- [ ] 01 已链接 [ ] commands 逐字一致 [ ] 11 = 固定句
- [ ] 每条硬门闸含 MUST/MUST NOT/SHOULD/SHOULD NOT/MAY
