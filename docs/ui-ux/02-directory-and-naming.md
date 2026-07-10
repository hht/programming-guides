# 02 — 目录与命名

## 树（钉死）

```text
design/
  tokens.md                 # 或注明「仅 Figma Variables」
  flows/
    <task-id>.md            # 用户流
  screens/
    <screen-id>.md          # 目的、主 CTA、内容清单
  matrices/
    <screen-id>.md          # 状态矩阵（可自 templates 复制）
  handoff.md                # 实现清单（见 templates/handoff.md）
  figma-notes.md            # file URL、Frame 列表、a11y: PASS
```

## 依赖方向

```text
INPUTS → flows → screens → matrices → figma-notes → handoff → 实现指南
```

禁止：`misc/`、`final-final/` 口袋；无 screen-id 的匿名 Frame。

## 命名 / join key（钉死）

| 种类 | 规则 |
|------|------|
| task-id | `kebab-case`，与 INPUTS 任务短名一致 |
| screen-id | `kebab-case`，全局唯一 |
| platform | 仅 `web`/`ios`/`android`/`macos`（小写） |
| Figma Frame | `<platform>/<task-id>/<screen-id>/<state>` |
| 矩阵行 | 同一 `screen-id` + 组件名 |
| 实现组件名 | `UI/<Name>/<Variant>` |

`screen-id` 是 flows / screens / matrices / Figma 的 **唯一 join key**。
