# Swift — Language Gate

> Normative: MUST / MUST NOT（RFC 2119；DO / DO NOT 同义，本文件统一用 MUST）

## 适用范围

- 应用册：[apple-platforms](../../apple-platforms/README.md)
- **MUST NOT** 把 SwiftUI 导航 / Observation Lifecycle 写入本闸（属应用册）

## 最高准则映射（必填）

| 准则 | 本语言如何落实（≤5 条硬门闸 ID） |
|------|----------------------------------|
| 极简 | G01, G02 |
| 清晰可测 | G03, G04, G05 |
| 算法精妙 | G06 |

## Formatter / Linter（仆人；互斥任选）

| 角色 | 工具 | 命令字符串 | 配置落点 |
|------|------|------------|----------|
| fmt | swift-format | `swift-format lint --recursive --strict .` | `.swift-format`（可空） |
| lint | SwiftLint | `swiftlint lint --strict` | `.swiftlint.yml` |

## 硬门闸

| ID | 归属准则 | 关键词 | 规约 | 探针 |
|----|----------|--------|------|------|
| G01 | 极简 | MUST NOT | 保留未使用的声明或死代码 | SwiftLint / 编译器；无理由 = FAIL |
| G02 | 极简 | MUST NOT | 无必要的包装类型层（D2） | 评审删层 |
| G03 | 清晰可测 | MUST | 用 `async`/`await` 表达异步；**MUST NOT** 在新代码默认回调金字塔 | 代码评审抽检；Swift Testing 可测路径 |
| G04 | 清晰可测 | MUST | 可失败操作用 `throws` 或 typed Result；禁止无分类的失败吞掉 | 单测 case→期望 |
| G05 | 清晰可测 | MUST | 领域逻辑可 `xcodebuild test` / Swift Testing；禁止假成功 | case→期望 |
| G06 | 算法精妙 | SHOULD | 热路径选充分简单算法；偏离写明 | 注释/基准 + 探针 |

## 命名边界

- Pass1/Pass2 → 应用册 `02`；本文件不写大小写表

## 证据与冲突

| 来源 | 采用? | why（相对 §0） |
|------|-------|----------------|
| Apple API Design Guidelines（可映射） | 部分 | 不整书；不抢 Pass1 |
| SwiftLint / swift-format | 是 | 可机械检查 |
| Google 无 Swift 全书默认 | N/A | — |

## 接入检查

- [ ] 01 已链接 [ ] commands 逐字一致 [ ] 11 = 固定句
- [ ] 每条硬门闸含 MUST/MUST NOT/SHOULD/SHOULD NOT/MAY
