# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | §1–8b 满足验收谓词；§2 小写平台；§2b 导航互斥已选；§4 槽位键非空 | OK |
| `check-ia` | flows+screens；每屏一主 CTA；screen-id 唯一 | OK |
| `check-matrix` | 每屏矩阵；八列不适用=N/A；非 N/A 有可见差异一句；primary 唯一 | OK |
| `check-a11y` | `07` 十项勾完；figma-notes 含 `a11y: PASS` | OK |
| `check-figma` | 命名=join key；Auto Layout；URL | OK |
| `check-handoff` | `design/handoff.md` 按模板填完 | OK |
| `check-acceptance` | `11` **A+B+D** 可勾项已勾（交付 agent）；**C 节仅指南维护者**（`check-guide`） | OK |
| `check` | 上列全部（**含** `check-acceptance`→`11` A+B+D） | exit 0 |
| `check-release` | `check` + `09` 发版矩阵 1–6（每条有证据路径，见 `09`） | exit 0 |
| `check-guide` | `11` **C** 节（§1.3 共有/超越元判定；维护者） | OK |
| `hand-off` | 同 check-handoff | 文件存在 |

PR / 日常交付：`check`。设计「发版」交付：`check-release`。指南本身达标：`check-guide`。
