# Python — Language Gate

> Normative: MUST / MUST NOT（RFC 2119；DO / DO NOT 同义，本文件统一用 MUST）

## 适用范围

- 应用册：[fastapi](../../fastapi/README.md)（及其他默认栈为 Python 的挂靠册）
- **MUST NOT** 把 FastAPI Depends / 路由 Lifecycle 写入本闸（属应用册框架 MUST）

## 最高准则映射（必填）

| 准则 | 本语言如何落实（≤5 条硬门闸 ID） |
|------|----------------------------------|
| 极简 | G01, G02 |
| 清晰可测 | G03, G04, G05, G07 |
| 算法精妙 | G06 |

## Formatter / Linter（仆人；互斥任选）

| 角色 | 工具 | 命令字符串 | 配置落点 |
|------|------|------------|----------|
| fmt | ruff format | `uv run ruff format --check .` | `pyproject.toml` `[tool.ruff]` |
| lint | ruff check | `uv run ruff check .` | 同上 |
| typecheck | mypy | `uv run mypy app` | `[tool.mypy]`：`strict = true`（生成代码可书面放宽） |

挂靠册可将 fmt+lint 合并为一条 `lint` 脚本，但**子命令字符串须与上表逐字一致**（见 fastapi `commands.md`）。

## 硬门闸

| ID | 归属准则 | 关键词 | 规约 | 探针 |
|----|----------|--------|------|------|
| G01 | 极简 | MUST NOT | 保留未使用的 import、函数、类或死代码 | `ruff` F401/F841 等 |
| G02 | 极简 | MUST NOT | 无调用方的 Helper/Manager 封装层（D2） | 评审：删后行为不变则删 |
| G03 | 清晰可测 | MUST | 注解与 mypy strict 通过；**MUST NOT** 用 `# type: ignore` 无理由刷绿 | `mypy` exit 0；ignore 须同行理由 |
| G04 | 清晰可测 | MUST | 边界校验用类型化模型（Pydantic/等价）；**MUST NOT** 对未校验 `dict` 当领域对象默认 | 单测；应用册可加强 |
| G05 | 清晰可测 | MUST | 领域纯函数可 pytest；禁止假成功 | case→期望 |
| G06 | 算法精妙 | SHOULD | 热路径（批量变换、解析）选充分简单算法；偏离写明 | 注释/基准 + 探针 |
| G07 | 清晰可测 | MUST NOT | 在请求路径使用可变默认参数 / 模块级可变单例缓存当请求隔离真相 | 单测并发 / 代码抽检 |

## 命名边界

- Pass1/Pass2 → 应用册 `02`；本文件不写大小写表

## 证据与冲突

| 来源 | 采用? | why（相对 §0） |
|------|-------|----------------|
| ruff（lint+format） | 是 | P0 生态标准；取代 flake8/black 双栈 |
| mypy strict | 是 | 可测与正确性 |
| Google Python Style | 部分 | 不整书入库；命名不抢 Pass1；与 ruff 冲突取 ruff+§0 |
| black 并行默认 | 否 | 与 ruff format 双开口禁止 |

## 接入检查

- [ ] 01 已链接 [ ] commands 逐字一致 [ ] 11 = 固定句
- [ ] 每条硬门闸含 MUST/MUST NOT/SHOULD/SHOULD NOT/MAY
