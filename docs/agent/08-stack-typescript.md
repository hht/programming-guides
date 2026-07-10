# 08 — TypeScript 栈（Vercel AI SDK）

## 不变量

- 仅当 INPUTS §2 = `typescript`  
- 工具参数与输出用 **Zod**；`tool`/`generateText`（或 `streamText`+终态聚合）  
- **pnpm**；`tsc --noEmit` 进 check  

## 步骤规格

1. `pnpm add ai zod` + `@ai-sdk/<provider>`。  
2. `tools: { [tool_name]: tool({ parameters: zodSchema, execute }) }`；名=INPUTS。  
3. 循环：用 SDK 的 maxSteps/stopWhen **或**自写 while，但须满足 `05` 边界（取严者）。  
4. 终态：优先 `generateObject` / 等价；校验失败须走 `05` 步骤 6 的**一次修复**，不得跳过直接只返回 `output_invalid`（除非预算已尽 → `budget_exceeded`）。  
5. 入口 `src/agent/index.ts`；eval 用 vitest 读 jsonl。  

## 失败分类

| 情况 | 行为 |
|------|------|
| zod 失败 | `tool_invalid_args` |
| maxSteps 与 INPUTS 不一致 | **以 INPUTS 较小值为准** |

## 探针

| case | 期望 |
|------|------|
| 未注册工具名 | 不 execute |
| `pnpm eval` | 金标全过 |
