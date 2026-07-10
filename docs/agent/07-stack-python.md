# 07 — Python 栈（Pydantic AI）

## 不变量

- 仅当 INPUTS §2 = `python`  
- Agent/工具参数/输出模型用 **Pydantic v2**  
- 依赖用 **uv**；`uv run` 进命令  

## 步骤规格

1. `uv add pydantic-ai`（及所选 provider 额外依赖，按官方文档）。  
2. 每个工具：`@agent.tool` 或等价注册；函数签名类型 = schema SSOT。  
3. 输出：`result_type=YourModel`（或等价）；校验失败走 `05` 修复/失败。  
4. 入口 `src/agent/app.py`：组装 Agent → 自写 while/`run` 包装，**取严**：框架 max 与 INPUTS `max_turns`/`max_tool_calls` 取较小值；映射为 `05` 信封。  
5. 单测：`uv run pytest`；eval：`uv run` 项目内 eval 入口（命令名见目标仓 Makefile，须映射 `commands.md` 的 `eval`）。  

## 失败分类

| 情况 | 行为 |
|------|------|
| 类型与 JSON 不符 | 启动或注册期失败 |
| 事件循环混用 | 钉一种：默认 `asyncio.run` 包一层 |

## 探针

| case | 期望 |
|------|------|
| 缺注解工具 | mypy/ruff 或运行注册失败 |
| gold 一条 | `uv run pytest` 或 `make eval` 绿 |
