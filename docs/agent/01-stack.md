# 01 — 默认栈

## 选栈总则

先进优先：端到端类型、显式 tool schema、可测循环 > 下载量。

## 双栈表（一本；单仓只启用一行）

| 层 | Python（INPUTS=`python`） | TypeScript（INPUTS=`typescript`） |
|----|---------------------------|-----------------------------------|
| 运行时 | Python ≥3.12 | Node ≥22 |
| 包管理 | **uv** | **pnpm** |
| Agent 框架 | **Pydantic AI** | **Vercel AI SDK**（`ai` + provider 包） |
| Schema | Pydantic v2 | **Zod** |
| 测试 | pytest | vitest |
| Lint/类型 | ruff + mypy / eslint + tsc | 命令 SSOT → [python](../meta/language-gates/python.md) 与 [typescript](../meta/language-gates/typescript.md) |

语言硬门闸：按 INPUTS 所选栈挂靠；**禁止**两栈命令混用不逐字。

| 日志 | structlog | **pino**（JSON） |

**禁止开口**：「LangChain 或随便选」；「两栈混在同一进程默认」。

## 脚手架

| 栈 | 命令 |
|----|------|
| Python | `uv init` → 加 `pydantic-ai`、`pytest`、`ruff`、`mypy`；锁 `uv.lock` |
| TypeScript | `pnpm init` + TS strict → 加 `ai`、`zod`、`vitest`；锁 `pnpm-lock.yaml` |

版本：创建时各生态**最新稳定版**写入 lockfile。

## 冲突表（sources）

| 流行候选 | 本指南 | 理由 |
|----------|--------|------|
| LangChain / LangGraph | **不用作默认** | 边界厚、类型弱于 Pydantic AI / AI SDK |
| OpenAI Agents SDK（双语言） | 可映射学 handoff；默认仍上表 | 金标同构不把它当作唯一 SDK API |
| 自研裸 fetch 循环 | 仅 INPUTS 明示「无框架」 | 默认用框架拿 tool 校验 |

## 金标同构

两栈共用 [templates/gold-case.schema.json](./templates/gold-case.schema.json) 与 `evals/*.jsonl` 字段；跑分命令见 `commands.md`。
