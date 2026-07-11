# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层 → [typescript Language Gate](../meta/language-gates/typescript.md)。本文件只含 **Node TUI/CLI 框架 MUST**。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST NOT | 在本指南仓堆业务实现；实现只在新仓 | 目录抽检 |
| F02 | MUST | 交互 UI 仅在 `stdin.isTTY && stdout.isTTY`（或 INPUTS 另定）下全屏 TUI | `09` case |
| F03 | MUST | 非 TTY 走非交互路径或 **exit 2** | 同上 |
| F04 | MUST | Exit：成功=0；运行失败=1；用法/校验=2；取消=130 | INPUTS 矩阵 + 单测 |
| F05 | MUST NOT | 取消与失败同码 | 同上 |
| F06 | MUST | 人类提示 → stderr；机器结果 → stdout | e2e / 单测 |
| F07 | MUST | 终局：`setMachineResult` → `exitCode` → `useApp().exit()`；`cli.ts` 在 `app.run()` **返回后** `takeMachineResult` 再写 stdout | `09` |
| F08 | MUST NOT | 挂载中 `process.exit()` / 挂载中写机器 stdout | 同上 |
| F09 | MUST NOT | 取消路径写 `ERROR:`；`ERROR:<CODE>` 仅失败 | 单测 |
| F10 | MUST NOT | 密钥进仓库或 stdout | 安全抽检 |
| F11 | MUST | deletion-first；依赖方向见下表 | 架构 lint / 抽检 |

## SSOT 表

| 真相 | Owner |
|------|--------|
| bin 名 / 包名 / env 前缀 | INPUTS → `package.json` + `config/` |
| 子命令树与 flag schema | `source/commands/**` + Zod |
| Exit code 表 | INPUTS 矩阵 → 仓内文档 + `domain/exit-codes.ts` |
| 机器 stdout schema | INPUTS |
| 配置文件路径 | INPUTS（策略 B/C）→ `config/paths.ts` |
| ERROR CODE 表 | INPUTS §10 → `domain/error-codes.ts` |

## 依赖方向

```text
cli.ts → Pastel → commands → ui → domain
 ↓
 services → domain
 ↓
 config
runtime/machine-result ← commands（set）← cli.ts（take）
```

**MUST NOT**：`domain` → `ink`|`services`；`ui` → `config`|`services`|`process.env`（只收 props）。
