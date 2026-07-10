# Node CLI × Ink TUI 开发指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**从零实现世界级门槛的 Node 交互式 CLI。  
> **默认栈**：Node ≥22 + TypeScript strict (ESM) + **Ink 7** + React 19 + **Pastel** + Zod + `@inkjs/ui` + Vitest + `ink-testing-library`。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

开发者在终端用 **子命令 + 交互 TUI** 完成主任务；进程以约定 **exit code** 与 **stdout/stderr 契约**结束。

## 核心正确性路径（全文唯一）

**Command Lifecycle**：`parse argv → 路由到命令 → render Ink UI → 完成主任务 → unmount →（cli 写 stdout）→ 以 process.exitCode 结束`。

## Agent 执行协议

1. 校验 [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或列缺口（有缺口则停）  
2. 在目标仓库按 [01](./01-stack-and-ink.md) 初始化默认栈；目录按 [02](./02-directory-and-naming.md)  
3. 按 [03](./03-cli-entry-and-argv.md) 落地入口、`bin`、Zod options  
4. 按 [04](./04-tui-render-and-input.md) / [05](./05-command-lifecycle.md) / [06](./06-io-exit-and-non-tty.md) 实现核心路径（**自己写代码，勿从本目录抄业务模块**）  
5. 按 [07](./07-config-auth-and-secrets.md) / [08](./08-packaging-and-release.md) 接配置与发包  
6. [commands.md](./commands.md) 门禁绿 + [11](./11-world-class-acceptance.md) 全勾  

`templates/` 只含 schema / env 名 / 矩阵 / scripts 键名，见 [templates/README.md](./templates/README.md)。

## 文档索引

| 文档 | 用途 |
|------|------|
| [INPUTS.md](./INPUTS.md) | 输入门闸 |
| [00-principles.md](./00-principles.md) | 不变量 |
| [01-stack-and-ink.md](./01-stack-and-ink.md) | 栈 |
| [02-directory-and-naming.md](./02-directory-and-naming.md) | 目录 |
| [03-cli-entry-and-argv.md](./03-cli-entry-and-argv.md) | 入口 / argv |
| [04-tui-render-and-input.md](./04-tui-render-and-input.md) | Ink 渲染 / 输入 |
| [05-command-lifecycle.md](./05-command-lifecycle.md) | 核心路径规格 |
| [06-io-exit-and-non-tty.md](./06-io-exit-and-non-tty.md) | I/O / exit / 非 TTY |
| [07-config-auth-and-secrets.md](./07-config-auth-and-secrets.md) | 配置 / 密钥 |
| [08-packaging-and-release.md](./08-packaging-and-release.md) | 打包 / 发版 |
| [09-testing-ci.md](./09-testing-ci.md) | 测试 |
| [10-checklist.md](./10-checklist.md) | 清单 |
| [11-world-class-acceptance.md](./11-world-class-acceptance.md) | 验收 |
| [commands.md](./commands.md) | 命令 |
| [sources.md](./sources.md) | 标杆与来源 |
| [templates/](./templates/README.md) | 非业务碎片 |

## 心智模型

```text
INPUTS → 新仓 Pastel+Ink → argv/路由 → TUI 生命周期 → exit 契约 → check → 验收
```
