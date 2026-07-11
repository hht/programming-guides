# 09 — 测试与 CI

> 指南不附可运行测试源码；实现仓自写。

## 单测（case → 期望）

| case | 期望 |
|------|------|
| reduce 纯 Event | 新 UiState 快照正确 |
| focus load 成功 | loading→success/empty |
| load NETWORK | error + 码；非假 success |
| 详情 404 | not-found |
| blur 后晚到响应 | 不覆盖 UiState |
| 快速切换 id | 仅最后 id 生效 |
| Repository 映射 | HTTP→错误码表 |
| Abort | 非 error UI |

## 发版矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | 主任务流快乐路径 | 矩阵 success 可见；关键 CTA 可用 |
| 2 | 主列表/屏 empty | empty 帧；非 error |
| 3 | 强制错误（假服务器/fake repo） | error + Retry；Retry 后可恢复 |
| 4 | 失焦取消 | 进入屏 A 加载中切走再返回；无错乱旧数据覆盖（可测或仪器） |
| 5 | 导航往返 | 列表→详情→返回；详情 id 正确 |
| 6 |（若有鉴权）未登录受保护 route | 去登录或等价；非假 success |
| 7 | RNTL 冒烟 | 至少 1 条主路径角色/文案断言 |
| 8 |（若有第三方原生）§10 表内模块 | 构建通过；运行时关键路径不因缺原生崩 |

## CI

| 门禁 | 何时 |
|------|------|
| 单元 / Lifecycle | 每 PR `check` |
| RNTL | 每 PR 或 nightly（commands 写明）；**发版必绿** |
| 矩阵 1–5 + 7 | 发版必绿 |
| 矩阵 6 | 有鉴权则发版必绿；无则 `N/A` |
| 矩阵 8 | 有 §10 第三方原生则发版必绿；无则 `N/A` |
| `expo-doctor` | 建议每 PR；失败策略实现仓写明（默认 warn→准出前 must） |
| `check-inputs` | 每 PR（含矩阵 + §9/§10） |
| `check-acceptance` | 每 PR：核对 `11` **A+B+D**（**不含** C） |
