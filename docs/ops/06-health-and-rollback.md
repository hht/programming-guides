# 06 — 健康检查与回滚

## 不变量

- 健康检查定义在 INPUTS §1；实现为脚本或 CI step，可本地跑 
- 回滚 = 将服务切回 `PREV` tag 并再跑健康门闸 
- 回滚后再失败 → 告警/人工（指南要求有明确失败态，不要求自动第三次） 

## 步骤规格

1. 实现健康检查（步骤见 templates；URL=§1+§1b）。 
2. 发布失败回滚：Kamal → `kamal rollback`；本地 → compose 切到 `previous-release.txt` 的 tag 后 `up -d`。 
3. 回滚后文件与 exit 码以 **`05` §8 为 SSOT**（回滚绿仍 `HEALTH_FAILED` 非 0；`current-release.txt`=PREV）。 
4. 回滚后再失败 → `ROLLBACK_FAILED`。 
5. 将健康 URL/超时写入 `ops/runbook.md`。 

## 失败分类

| 情况 | 行为 |
|------|------|
| 健康超时 | 视为失败 |
| 无 PREV | `ROLLBACK_UNAVAILABLE` |
| 回滚后仍挂 | `ROLLBACK_FAILED` |

## 探针

| case | 期望 |
|------|------|
| 故意坏镜像 | 健康红 → 回滚 → 旧健康绿 |
| 首次发布坏 | 失败终态，不假成功 |
