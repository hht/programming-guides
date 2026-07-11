# 08 — 质量

## 必做

- `uv run ruff check` + `uv run ruff format --check` 
- `uv run mypy app` 
- `uv run pytest` 
- 生产：structlog JSON；`APP_ENV=prod` 时默认 info，禁把 secrets 打进日志 

## 宜做 / 参考

| 项 | 要求 |
|----|------|
| coverage | 宜做；裁则 11 写理由（本指南默认裁：发版以集成矩阵为准） |
| OTel/Sentry | **仅参考**，不进必勾 |

## 单测探针

| case | 期望 |
|------|------|
| ruff + mypy | CI exit 0 |
