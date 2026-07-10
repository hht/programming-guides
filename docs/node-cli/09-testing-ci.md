# 09 — 测试与 CI

## 单测（必做）

| 区域 | case → 期望 |
|------|-------------|
| Zod options | 缺必填 → 失败；合法 → 通过 |
| domain / exit | 错误类型 → 1；取消 → 130；用法 → 2 |
| machine-result | set → take 一次取走；二次 take 为空 |
| config | 缺 env → err；redact token |
| UI | `ink-testing-library`：`lastFrame()`；按键后帧变化 |

默认文件位置：`source/**/*.test.ts(x)`。

## 发版 e2e（必做；最小规格）

**跑法（钉死）：** `pnpm test:e2e` 用 Vitest；每个 case `spawn('node', ['build/cli.js', ...args], { env })`（或 bin 路径），断言 `exitCode` + stdout/stderr 子串。  
**前置：** `pnpm build`。  
**fixture：** `source/__fixtures__/` 或 `source/**/fixtures/`（JSON/文本）；禁止依赖真实外网（mock 或 MSW 等价）。

| # | 场景 | 断言 |
|---|------|------|
| 1 | `--help` | exit 0；stdout 含 bin 名 |
| 2 | 默认命令 **CI 成功入口**（INPUTS §9 所钉 argv；无 TTY） | exit 0；若有机器 schema 则 stdout 可解析 |
| 3 | 非法 flag | exit 2；stderr 含 `ERROR:USAGE` |
| 4 | 交互命令**不带** CI 成功 flag，且非 TTY | exit **2**；stderr `ERROR:USAGE` |
| 5 | 取消（可测则测） | exit 130 |

说明：#2 与 #4 不冲突——#2 走 INPUTS 钉死的无 TTY 成功 argv；#4 走需要 TUI 的调用。真实 PTY：**宜做**。

## CI

| 触发 | 命令 |
|------|------|
| PR | `pnpm check` |
| 发版 | `pnpm check` && `pnpm build` && `pnpm test:e2e`（矩阵 1–4） |
