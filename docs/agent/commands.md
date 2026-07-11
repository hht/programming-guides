# commands

| 脚本 | 命令 | 何时 | 期望 |
|------|------|------|------|
| `check-inputs` | INPUTS §1–8 谓词 | 本地/PR | OK |
| `check-schema` | `evals/gold.jsonl` 每行过 gold-case.schema | PR | OK |
| `fmt-py` | `uv run ruff format --check .` | PR（Python 栈） | exit 0 |
| `lint-py` | `uv run ruff check .` | PR（Python 栈） | exit 0 |
| `typecheck-py` | `uv run mypy app` | PR（Python 栈） | exit 0 |
| `fmt-ts` | `pnpm exec prettier --check .` | PR（TypeScript 栈） | exit 0 |
| `lint-ts` | `pnpm exec eslint .` | PR（TypeScript 栈） | exit 0 |
| `typecheck-ts` | `pnpm exec tsc -b --pretty false` | PR（TypeScript 栈） | exit 0 |
| `test` | 单测探针（按所选栈） | PR | exit 0 |
| `eval` | 金标全过 | 发版 | exit 0 |
| `check-acceptance` | `11` A/B/C/D 可勾项 | PR | OK |
| `check` | inputs + gold schema + **所选栈** fmt/lint/typecheck + test + acceptance；**不含**全量 live eval | PR | exit 0 |
| `check-release` | `check` + `eval` | 发版 | exit 0 |

Python 子串与 [python Language Gate](../meta/language-gates/python.md) 逐字一致；TypeScript 子串与 [typescript Language Gate](../meta/language-gates/typescript.md) 逐字一致。单仓只选一栈时，另一组脚本标 N/A。
