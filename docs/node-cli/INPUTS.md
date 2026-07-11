# INPUTS — 缺则停

实现 agent 开工前逐项勾选。任一项缺失 → 输出缺口列表并**停止写业务代码**。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **身份** | npm 包名、`bin` 命令名、env 前缀（例：`MYCLI_`）三者须写明 |
| 2 | **命令面** | 子命令树（含默认）；每命令：一句话 + **flags/args 表**（名/类型/必填/默认）+ help 只来自 Zod `.describe()` |
| 3 | **主任务 UX** | 主交互线框（ASCII/设计稿）：区域、键盘、成功/失败终态 |
| 4 | **命令状态矩阵** | 填 [templates/command-state-matrix.md](./templates/command-state-matrix.md) |
| 5 | **Exit 契约** | 填 [templates/exit-code-matrix.md](./templates/exit-code-matrix.md)（须含 0/1/2/130） |
| 6 | **机器 stdout / 管道** | □ 无机器结果 □ JSON 单行+字段表。管道：□ 不读 stdin □ stdin 格式+字段表 |
| 7 | **环境** | □ 无远程（写「无 API」） □ `PREFIX_ENV`+成对基址 □ 仅不同 `PREFIX_API_URL` |
| 8 | **配置与密钥** | **A** 仅 env **B** 文件+env（必写路径）**C** token 文件（路径+权限） |
| 9 | **CI 成功入口（必做）** | 写明一条**无 TTY** 可成功的 argv 例（如 `mycli do --yes`）。另：`CI=true` 时跳过确认。禁止「完全无可测成功路径」 |
| 10 | **ERROR CODE 表** | `CODE` + 触发条件（无后端也要有，至少含 `USAGE`） |
| 11 | **部分成功** | □ 不可能 □ 回滚+`exit 1`+`ERROR:PARTIAL` □ `exit 1`+stderr 每行 `PENDING:`；禁止部分成功 exit 0 |

## 若适用（适用则必填）

| # | 项 | 何时适用 |
|---|-----|----------|
| 12 | 后端 API 契约 | 基址 env、端点 method+path、请求/响应字段、错误→`ERROR:<CODE>` |
| 13 | 鉴权 | token 位置（header 名/文件）；过期 CODE |
| 14 | 长任务清理 | Ctrl+C 是否删临时文件 |

## 门闸输出

```text
INPUTS OK
```

或 `INPUTS BLOCKED:` + 缺口列表。
