# 02 — 目录与命名

## 树（钉死；按栈二选一根）

### Python

```text
src/
  agent/
    app.py              # 入口：组 Agent + 跑 turn
    tools/              # 一工具一模块
    schemas/            # 输出/工具参数模型
  domain/               # 纯函数（可单测，无 LLM）
evals/
  gold.jsonl            # 金标（同构）
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
tests/                  # vitest 单测（与 evals 分离）
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

| 种类 | 规则 |
|------|------|
| tool_name | `snake_case`（两栈同名，便于金标） |
| 金标 id | `kebab-case` |
| 环境变量 | `AGENT_MODEL`、`OPENAI_API_KEY` 等；见 env.example |
