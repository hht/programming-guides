# 09 — 测试与 CI

## 单测

| case | 期望 |
|------|------|
| Zod 坏输入 | Action ok=false |
| 未授权 Action | unauthorized |
| revalidate 后读 | 新值 |

## 发版矩阵

| # | 场景 | 断言 |
|---|------|------|
| 1 | 主读路径 | 200 + 主内容 |
| 2 | 主写路径 | 成功后刷新可见 |
| 3 | 校验失败 | 不写库 |
| 4 | 未登录写 | 拒绝 |
| 5 | build | exit 0 |
| 6 | 无密钥进 PUBLIC | 扫描过 |

## CI

PR：`check`。发版：`check` + Playwright 场景 1–4；场景 5–6 由 `check`/`build` 与密钥扫描覆盖（不必进 Playwright）。
