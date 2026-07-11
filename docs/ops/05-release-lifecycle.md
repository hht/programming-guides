# 05 — Release Lifecycle（核心正确性路径）

## 不变量

全文唯一主路径：`构建 → 推送 → 预检/迁移 → 切换 → 健康门闸 → 成功 | 回滚`。

超越：

1. `对照：B 中更弱/未见「健康门闸未过不得标成功」硬门闸 → 本指南要求` 
2. `对照：B 中更弱/未见「上一版本可切回作为默认回滚」硬门闸 → 本指南要求`

## 发布状态机（交付态；本品类无 UI 三态）

```text
idle → building → pushing → migrating → switching → health_checking
 → success
 → rolling_back → success | rollback_failed
 → failed（FIRST 且健康失败）
```

## 步骤规格（须遵守）

1. **构建**：`docker build`；tag = **短 sha**（`02`）。状态=`building`。 
2. **推送**：推到 INPUTS §4（`local-only` 则 skip）。状态=`pushing`。 
3. **预检 / 迁移**： 
 - INPUTS §7 = 无/`N/A` → **跳过** `migrating`（直接步骤 4）。 
 - INPUTS §7 = 有 → 状态=`migrating`；执行 INPUTS 所写**唯一命令字符串**（例 `uv run alembic upgrade head`）；失败 → 中止、不切换、exit=`MIGRATE_FAILED`。 
4. **记录上一版本**：切换前 `ops/previous-release.txt`=`当前短 sha` 或 `FIRST`。 
5. **切换**（状态=`switching`）： 
 - INPUTS §3 本地 only → `docker compose up -d` 到该 tag。 
 - INPUTS §3 Kamal → **`kamal deploy`**（唯一远程命令面）。 
6. **健康门闸**（状态=`health_checking`）：用 INPUTS §1+§1b 拼 URL；**所有**服务须全过；期望码见 `health_ok_codes`（默认仅 200）；超时 60s、间隔 5s。任一失败 → 不标成功，步骤 8。 
7. **成功**：`ops/current-release.txt`=`新短 sha`；状态=`success`；`release` **exit 0**。 
8. **回滚**：`previous`≠`FIRST` → 切回该 tag + 再健康（全服务）。 
 - 回滚后健康绿：`current-release.txt`=`previous` 的短 sha；状态=`success`（服务恢复）但本次 **`release` 仍 exit ≠0**，打印 `HEALTH_FAILED`（新版本发布失败；集群在旧版本）。 
 - 回滚后仍挂：exit=`ROLLBACK_FAILED`。 
 - `FIRST`：exit=`ROLLBACK_UNAVAILABLE`；勿改写 current 为新 sha。 

## 失败分类

| 情况 | 行为 |
|------|------|
| 构建/推送失败 | 中止 |
| 迁移失败 | 中止；不切换 |
| 健康失败 | 回滚或 failed |
| 无 PREV | `ROLLBACK_UNAVAILABLE` |

状态写入 CI 日志；可选在 job summary 打印当前态名。成功/失败以步骤与 `commands.md` 退出码为准。
