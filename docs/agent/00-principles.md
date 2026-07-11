# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [python Language Gate](../meta/language-gates/python.md) **与** [typescript Language Gate](../meta/language-gates/typescript.md)（按 INPUTS 所选栈各跑一门）。  
> 本文件只含 **Agent Turn 框架 MUST**（不抢语言闸）。

## 决策优先级

正确性（终态可验证）> 可验证性 > 简洁性 > 复用 > 速度。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | 未在 INPUTS §4 声明的工具不可调用 | `04` / eval |
| F02 | MUST | 写/外呼工具须超时、错误分类、（默认）人在环或幂等键 | `04` / `05` |
| F03 | MUST | 终态过 OUTPUT 契约（JSON Schema 或约定解析器） | `05` / `06` |
| F04 | MUST | turn / 工具次数触顶 → 失败终态 | `05` 单测 |
| F05 | MUST NOT | 静默死循环 | 同上 |
| F06 | MUST | 发版前 `eval` 对金标集断言通过 | `commands` eval |
| F07 | MUST NOT | 无金标称完成 | `11` |
| F08 | MUST NOT | 密钥入库；只读环境变量名 | 安全抽检 |
| F09 | MUST | deletion-first；无 INPUTS 的工具/角色不做 | INPUTS |

## SSOT

| 真相 | Owner |
|------|--------|
| 任务与成功标准 | INPUTS §1 |
| 工具集 | INPUTS §4 + `04` |
| 输出契约 | INPUTS §5 |
| Turn 循环 | `05` |
| 金标格式 | `06` + templates（两栈同构） |
| 栈实现细节 | `07` 或 `08` |

## 超越

1. `对照：B 中更弱/未见「金标 JSONL + 发版 eval 硬门闸」同构要求 → 本指南要求`  
2. `对照：B 中更弱/未见「工具白名单 + 有界 turn 失败终态」硬门闸 → 本指南要求`
