# Agent 开发指南（Python + TypeScript 一本）

> **这是工程指南，不是半成品项目。** 
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**从零实现世界级门槛的 **tool-using LLM Agent**。 
> **默认栈**：见 [01](./01-stack.md) — Python = **Pydantic AI**；TypeScript = **Vercel AI SDK**；**金标/评测骨架同构**。 
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户给出任务；Agent 在受控工具集上多轮推理与调用，产出可验证的最终结果（结构化或约定文本），并用金标评测门闸证明正确性。

## 核心正确性路径（全文唯一）

**Agent Turn Lifecycle**：见 [05](./05-agent-turn-lifecycle.md)（收任务 → 模型/工具循环 → 信封）。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停 
2. [01](./01-stack.md) 按 INPUTS §2 选择 **python** 或 **typescript**（一本两栈，单仓只择一栈；双仓各跟一章） 
3. [02](./02-directory-and-naming.md) 建目录 
4. [03](./03-providers-and-models.md) / [04](./04-tools-and-permissions.md) / [05](./05-agent-turn-lifecycle.md) 
5. [06](./06-eval-and-gold.md) 金标同构；再按栈读 [07](./07-stack-python.md) 或 [08](./08-stack-typescript.md) 
6. [commands.md](./commands.md)：日常 `check`；**交付完成**须 `check-release`（含 `eval`）全绿 
7. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) 全勾 

收工定义：`check-release` exit 0 + `10`/`11` 勾完。仅 `check` 绿 ≠ 交付完成。 

## 索引

| 文档 | 用途 |
|------|------|
| INPUTS / 00–11 / commands / sources / templates | 规格与模板 |
