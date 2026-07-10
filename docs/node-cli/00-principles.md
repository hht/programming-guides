# 00 — 原则与不变量

## 不变量

1. **指南 ≠ 项目**：本目录无业务实现；实现只在新仓。  
2. **TTY 与管道分离**：交互 UI 仅在 `stdin.isTTY && stdout.isTTY`（或 INPUTS 另定）下全屏 TUI；否则走非交互路径或 **exit 2**。  
3. **Exit code 是契约**：成功=0；运行失败=**1**；用法/校验=**2**；取消（Esc/SIGINT/SIGTERM）=**130**。取消不得与失败同码。  
4. **人类 vs 机器输出**：人类提示 → stderr；机器结果 → stdout（格式由 INPUTS 钉死）。  
5. **终局挂载点（钉死）**：  
   - 命令内：`setMachineResult(payload?)` → 设 `process.exitCode` → `useApp().exit()`  
   - **`source/cli.ts`**：`await app.run()` **返回后**再 `const r = takeMachineResult(); if (r != null) stdout.write(...)`  
   - 模块：`source/runtime/machine-result.ts`（仅 get/set/take，无业务）  
   - **禁止**挂载中 `process.exit()` / 挂载中写机器 stdout  
6. **取消不写 `ERROR:`**：取消仅短提示或静默；`ERROR:<CODE>` 只用于失败。  
7. **密钥不进仓库、不进 stdout**。  
8. **deletion-first**；**SSOT** 见下表。

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

禁止：`domain` → `ink`|`services`；`ui` → `config`|`services`|`process.env`（只收 props）。
