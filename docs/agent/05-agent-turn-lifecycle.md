# 05 — Agent Turn Lifecycle（核心正确性路径）

## 不变量

全文唯一主路径：`收任务 →（模型步 → 工具步*）* → 终态 → 契约校验 → 返回信封`。

超越：

1. `对照：B 中更弱/未见「工具白名单 + 有界 turn 失败终态」硬门闸 → 本指南要求`  
2. `对照：B 中更弱/未见「金标 JSONL + 发版 eval 硬门闸」同构要求 → 本指南要求（门闸在 06）`

## 返回信封（钉死）

```text
{
  "status": "ok" | "error",
  "error_code": null | "<code>",
  "output": <any|null>,
  "turns": <int>,
  "tool_calls_count": <int>
}
```

**终态** `error_code` 允许：`budget_exceeded` | `output_invalid` | `provider_auth` | `provider_unavailable` | `provider_timeout` | `cancelled` | `tool_error`

- `tool_error` **仅**当 INPUTS §4 该工具 `fatal_on_error=yes` 且观察 `ok=false` 时作为信封码。  
- 其它 `tool_denied` / `tool_invalid_args` / `tool_timeout` / 非 fatal 的 `tool_error`：**只在观察**里，继续循环。

## 观察消息形（钉死）

```text
{ "role": "tool", "tool_name": "<name>", "ok": true|false, "error_code": null|"tool_*", "body": <any> }
```

## 步骤规格（钉死）

1. **收任务**：`turns=0`，`tool_calls_count=0`。  
2. **预算预检**：若 `turns >= max_turns` 或 `tool_calls_count >= max_tool_calls` → `status=error,error_code=budget_exceeded`。  
3. **模型步**：发起调用前不改计数；调用**开始**时 `turns += 1`。  
   - 成功 → 解析响应，进步骤 4。  
   - 失败 → **立即**返回 `status=error` + 对应 `provider_*`（已计入本次 turn）；不进入工具/终态。  
4. **分支（互斥）**：  
   - `tool_calls` 非空：忽略同消息终态文本；进入步骤 5。  
   - 仅有候选输出文本：进入步骤 6。  
   - 皆空：`output_invalid`。  
5. **工具批（串行）**：对每个 call：  
   - 若 `tool_calls_count >= max_tool_calls` → **中断剩余 calls**，追加观察 `{ok:false,error_code:budget_exceeded}` 语义的 tool 观察（`error_code` 用 `tool_error`，body 说明 budget），然后 **回步骤 2**（预检将返回 `budget_exceeded`）。  
   - 否则 `tool_calls_count += 1`，执行 `04`，追加观察；若该工具 `fatal_on_error=yes` 且 `ok=false` → 立即信封 `error`+`tool_error`。  
   - 批处理完 → **回步骤 2**。  
6. **终态路径**：校验 OUTPUT。  
   - 通过 → `ok`。  
   - 失败 → **恰好一次**修复：追加 `{role:"user", body:"Your previous output failed schema validation. Return corrected output only."}` → 步骤 2 → 步骤 3 → 再校验；仍失败 → `output_invalid`；修复前预检失败 → `budget_exceeded`。  
   - 修复轮若返回 `tool_calls`：按步骤 4/5 处理（计入预算）；校验失败触发的修复机会仍只有一次。  
7. **人在环**（嵌在步骤 5）：需审批的工具先 `tool_calls_count += 1` 再等审批；拒绝 → `cancelled`；通过 → `execute`。  

## 默认值

| 项 | 值 |
|----|-----|
| max_turns | INPUTS §7 或 **8** |
| max_tool_calls | INPUTS §7 或 **16** |
| fatal_on_error | 默认 **no** |

## 探针

| case | 期望 |
|------|------|
| 模型 401 | `error`+`provider_auth`；turns≥1 |
| 批内第 N 次工具触顶 | 剩余不执行；终态 `budget_exceeded` |
| tool_denied 观察 | 默认继续循环，非假成功除非模型随后给出 ok 输出 |
| 同消息 text+tools | 只跑工具 |
