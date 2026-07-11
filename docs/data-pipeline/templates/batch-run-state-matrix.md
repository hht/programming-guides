# BatchRun 状态矩阵

> 实现仓 UI / API 若暴露运行状态，转移必须落在本表；词表对齐 `02` Pass1。

| From | Event | To | 备注 |
|------|-------|-----|------|
| — | open run | `pending` | 写入 idempotency_key |
| `pending` | worker/编排开始 | `running` | stage=extract |
| `running` | extract/transform/load/verify 推进 | `running` | 仅更新 stage |
| `running` | verify 全过 | `succeeded` | 提交水位；可 ack Job |
| `running` | 任一步失败且可重试 | `failed` | 或直接由 runner 挂起 retry |
| `failed` | retry 调度 | `pending` 或 `running` | attempt+1；对齐 workers-queue |
| `failed` / `running` | 超限或 permanent | `dead` | 可查询 last_error |
| `succeeded` | — | — | 终态；同键默认 reject 新开 |
| `dead` | 人工重放 | 新 `pending` | **新** idempotency_key 或 INPUTS 写明 resume |

非法：`pending`→`succeeded`（跳过四步）；`running`→`succeeded` 且无 verify 记录。
