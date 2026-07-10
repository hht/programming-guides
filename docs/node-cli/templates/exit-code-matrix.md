# Exit code 矩阵（INPUTS 填空）

| 语义 | code | stderr 要点 | 备注 |
|------|------|-------------|------|
| 成功 | 0 | 通常空 | 机器结果在 stdout（TUI unmount 之后写） |
| 运行/业务失败 | 1 | `ERROR:<CODE> <message>` | CODE 见 INPUTS 错误表 |
| 用法/校验失败 | 2 | `ERROR:USAGE …` | 含非 TTY、缺 flag |
| 用户取消（Esc） | **130** | 可选短提示，**无** `ERROR:` | |
| SIGINT / SIGTERM | **130** | 可选 | 同等 |

产品勾选后把终表拷贝进新仓 README 或 `docs/exit-codes.md`。
