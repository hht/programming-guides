# 09 — 测试与 CI

## 单测（`test`；探针 SSOT 在此，`05` 为规格引用）

| case | 期望 | 条件 |
|------|------|------|
| Zod 坏输入 | Action `ok:false` + `validation` | 始终 |
| 未授权 Action | `unauthorized` | **仅** INPUTS §5=Cookie；§5=无 → 本行 N/A |
| 无权限 | `forbidden` | 仅 §5=Cookie 且 §5b=角色表；否则 N/A |
| revalidate 后读 | 新值 | 始终 |

## 发版矩阵

| # | 场景 | 断言 | 条件 |
|---|------|------|------|
| 1 | 主读路径 | 200 + 主内容 | 始终 |
| 2 | 主写路径 | 成功后刷新可见 | 始终 |
| 3 | 校验失败 | 不写库 | 始终 |
| 4 | 未登录写 | 拒绝 | **仅** §5=Cookie；§5=无 → **N/A（跳过，勿假失败）** |
| 5 | build | exit 0 | 始终 |
| 6 | 无密钥进 PUBLIC | 扫描过 | 始终 |

## CI

PR：`check`。发版：`check-release`（`check` + Playwright 场景 1–4 中**非 N/A** 项；5–6 由 `check`/`build` 与密钥扫描覆盖）。
