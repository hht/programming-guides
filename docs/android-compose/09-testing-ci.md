# 09 — 测试与 CI

> 指南不附可运行测试源码；实现仓自写。

## 单测（case → 期望）

| case | 期望 |
|------|------|
| reduce 纯 Event | 新 UiState 快照正确 |
| Refresh 成功 | Turbine：loading→success/empty |
| Refresh NETWORK | error + 码；非假 success |
| 详情 404 | not-found |
| 并发旧响应 | 不覆盖新状态 |
| SavedState 键 | 读写往返一致 |
| Repository 映射 | HTTP→错误码表 |

## 发版矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | 主任务流快乐路径 | 矩阵 success 可见；关键 CTA 可用 |
| 2 | 主列表/屏 empty | empty 帧；非 error |
| 3 | 强制错误（假服务器/fake repo） | error + Retry；Retry 后可恢复 |
| 4 | 配置变更 | 旋转（或等价）后业务状态/实体 id 不丢 |
| 5 | 导航往返 | 列表→详情→返回；详情 id 正确 |
| 6 |（若有鉴权）未登录受保护目的地 | 去登录或等价；非假 success |
| 7 | Compose UI Test 冒烟 | 至少 1 条主路径控件断言（文案/角色） |

## CI

| 门禁 | 何时 |
|------|------|
| 单元 / Turbine | 每 PR `check` |
| Compose UI Test（模拟器或托管） | 每 PR 或 nightly（须在 commands 写明）；**发版必绿** 矩阵 1–5 + 7 |
| 矩阵 6 | 有鉴权则发版必绿；无则 `N/A` |
| `check-inputs` | 每 PR（含矩阵已填） |
| `check-acceptance` | 每 PR：核对 `11` **A+B+D**（**不含** C） |
