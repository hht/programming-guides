# 03 — 提供商与模型

## 不变量

- 模型 id 与提供商只来自 INPUTS §3/§3b  
- 温度等采样参数：默认 **temperature=0**（评测可复现）；产品要随机须在 INPUTS 写明  
- 超时：单次模型调用默认 **60s**；可改但单处配置  

## 步骤规格

1. 读 INPUTS 选 provider SDK（Py：Pydantic AI model；TS：`@ai-sdk/openai` 等）。  
2. 配置从环境变量注入；缺 key → 启动失败（非空跑）。  
3. 评测模式：`AGENT_EVAL=1` 时允许 mock 模型（见 `06`）；生产禁 mock。  
4. 记录：每次 turn 打 `request_id` / `turn` / `model`（无密钥）。  

## 失败分类

| 情况 | 行为 |
|------|------|
| 401/403 | 失败终态 `provider_auth`；不重试密钥 |
| 429/5xx | 有限重试 ≤2，指数退避；仍失败 → `provider_unavailable` |
| 超时 | `provider_timeout` |

## 探针

| case | 期望 |
|------|------|
| 无 API key | 进程非 0 退出或明确错误 |
| temperature 未设 | 为 0 |
