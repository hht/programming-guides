# 业务命名（写进每个领域 `02` 的强制块 · 复制后填词表）

> 元指南 §1.2「命名/词表」验收用。Pass 1 未完成不得以「已有 snake_case 表」宣称命名齐套。

## Pass 1 — 业务语义（先 · 必做）

1. 目标仓建或更新 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。 
2. **领域、能力、实体、业务操作** = 目录、类型、函数、事件、错误码的词根。 
3. **禁**技术翻译名进领域：`*Dto` `*Entity` `*Model` `*Manager` `*Service` `*Helper` `*Processor` `handle*` `process*` `do*`（词表未收录则禁）。 
4. **禁**同义词分叉：一词一义；UI 文案与代码同词根。 
5. 对外协议字段名冻结在词表；改名=契约变更。

## Pass 2 — 语法（后）

仅给 Pass 1 已确定的业务词套语言惯例（camelCase / snake_case / kebab-case 等）。

## 基础设施例外

`HttpClient`、`pgxpool`、`Dockerfile` 等可技术名 — **不得**当作 `features/` / 领域模块的主名字。
