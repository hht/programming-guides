# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（按栈二选一根）

### Python

```text
src/
 agent/
 app.py # 入口：组 Agent + 跑 turn
 tools/ # 一工具一模块；模块名=业务能力
 schemas/ # 输出/工具参数模型
 domain/ # 纯函数（可单测，无 LLM）
evals/
 gold.jsonl # 金标（同构）
tests/
pyproject.toml
```

### TypeScript

```text
src/
 agent/
 index.ts
 tools/
 schemas/
 domain/
evals/
 gold.jsonl
tests/ # vitest 单测（与 evals 分离）
vitest.config.ts
package.json
```

## 依赖方向

```text
入口 → agent 编排 → tools → domain
evals → 只读调用入口/门闸；禁 tools 依赖 evals
```

禁止：`utils/` 大口袋；工具实现写进 prompt 字符串当唯一 SSOT。

**单仓单栈**：INPUTS §2 选一；本树只建对应根。双语言 = **两个独立 git 仓库**（共享的是金标字段同构，不是 monorepo 双包默认）。禁止默认 monorepo 混栈。

UI 状态矩阵：本品类默认 **N/A**（CLI/API）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`（工具能力 = 业务动词）。 
2. **tool_name / 金标 id / domain 模块** = 可对用户解释的业务能力（`lookup_order`、`refund-case`），禁 `tool1`、`helper`、`run_llm`、`process_input`。 
3. **禁** `*Manager` `*Helper` `handle_*` 作 tool_name。 
4. 金标场景名与产品验收用语同根。

| 概念 | 正例 | 反例 |
|------|------|------|
| tool_name | `lookup_order` | `fetch_data` / `tool_a` |
| 金标 id | `refund-happy-path` | `case-001` |
| domain | `domain/eligibility.py` | `domain/utils.py` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| tool_name | `snake_case`（两栈同名，便于金标；词来自 Pass 1） |
| 金标 id | `kebab-case` |
| 环境变量 | `AGENT_MODEL`、`OPENAI_API_KEY` 等；见 env.example |
