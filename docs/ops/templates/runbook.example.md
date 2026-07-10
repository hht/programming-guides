# Runbook 例

## 发布
1. CI release 或 `kamal deploy`
2. 确认 `ops/current-release.txt`
3. healthcheck 绿

## 回滚
1. `rollback` 或 Kamal rollback
2. healthcheck
3. 若 `ROLLBACK_FAILED` → 人工

## 健康
- URL:
- 超时: 60s
