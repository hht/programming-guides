# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | INPUTS §1–8 谓词 | OK |
| `check-schema` | `evals/gold.jsonl` 每行过 gold-case.schema | OK |
| `lint` | ruff/mypy 或 eslint+tsc | exit 0 |
| `test` | 单测探针 | exit 0 |
| `eval` | 金标全过 | exit 0 |
| `check-acceptance` | `11` A/B/C/D 可勾项 | OK |
| `check` | inputs 谓词 + gold schema + lint + test + **acceptance（11 可勾）**；**不含**全量 live eval | exit 0 |
| `check-release` | `check` + `eval` | exit 0 |

Python 例：`uv run ruff` / `uv run pytest` / `uv run python -m agent.eval`。 
TypeScript 例：`pnpm lint` / `pnpm test` / `pnpm eval`。
