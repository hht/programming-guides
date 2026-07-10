# Python 命令键名（映射到 commands.md）

目标仓用 Makefile（推荐）或等价脚本，键名须齐全：

```makefile
check-inputs:
	@# INPUTS §1–8 predicates
check-schema:
	uv run python scripts/check_gold_schema.py
lint:
	uv run ruff check . && uv run mypy src
test:
	uv run pytest
check-acceptance:
	@# tick 11
check: check-inputs check-schema lint test check-acceptance
eval:
	uv run python -m agent.eval
check-release: check eval
```

禁止把 `check`/`check-release` 做成空 `true`。
