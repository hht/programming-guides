# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | §1–8 满足验收谓词；§2 小写平台；§2b 导航互斥已选 | OK |
| `check-ia` | flows+screens；每屏一主 CTA；screen-id 唯一 | OK |
| `check-matrix` | 每屏矩阵；八列不适用=N/A | OK |
| `check-a11y` | `07` 十项勾完；figma-notes 含 `a11y: PASS` | OK |
| `check-figma` | 命名=join key；Auto Layout；URL | OK |
| `check-handoff` | `design/handoff.md` 按模板填完 | OK |
| `check-acceptance` | `11` A/B/C/D 可勾项已勾 | OK |
| `check` | 上列全部（**含** `check-acceptance`→`11`）+ `09` 矩阵 1–6 | exit 0 |
| `hand-off` | 同 check-handoff | 文件存在 |
