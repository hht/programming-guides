# 04 — 工具与权限

## 不变量

- 每个工具：名称、JSON Schema（或等价）、副作用级别、超时、`fatal_on_error`（默认 no）  
- **白名单**：运行时注册集 = INPUTS §4 允许集  
- 写/外呼：默认需 `INPUTS §11` 人在环；若不要，须书面「自动执行」+ 幂等键  
- 观察/信封错误码语义见 **`05`（SSOT）**；本文件只定义工具执行与观察产出  

## 步骤规格

1. 为每个工具写 schema（Py: Pydantic；TS: Zod）→ 生成/对齐 JSON Schema。  
2. 实现函数：校验入参 → 执行 → 返回观察 `{ok,error_code,body}`（形见 `05`）。  
3. 包装：超时（INPUTS 或默认 10_000ms 读 / 30_000ms 写）。  
4. `fatal_on_error=yes` 且 `ok=false` → 编排层按 `05` 立即信封 `tool_error`；否则只追加观察并继续。  
5. 注册到 Agent；未注册名 → 观察 `tool_denied`，不执行。  

## 失败分类（观察码）

| 情况 | 观察 error_code |
|------|-----------------|
| 未知工具名 | `tool_denied` |
| schema 失败 | `tool_invalid_args` |
| 超时 | `tool_timeout` |
| 执行异常 | `tool_error` |

## 探针

| case | 期望 |
|------|------|
| 调用未声明工具 | 不执行副作用 |
| 坏参数 | 不执行；返回 invalid_args |
