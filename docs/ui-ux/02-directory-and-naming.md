# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树（钉死）

```text
design/
  tokens.md                 # 或注明「仅 Figma Variables」
  flows/
    <task-id>.md            # 用户任务（业务名）
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

## 命名

### Pass 1 — 业务语义（必做）

1. 设计仓/产品仓建 `UBIQUITOUS_LANGUAGE.md`（或 design 内词表节）。  
2. **task-id / screen-id** = 用户任务与业务场景（`place-order`、`connect-wallet`），禁 `screen-1`、`page-a`、`temp`、`final`。  
3. Frame、矩阵行、handoff 组件名与实现指南 **同业务词根**；禁设计师口语与工程代号两套。  
4. 状态名用业务可读词（`empty`/`error`/`connected`），禁 `state3`。

| 概念 | 正例 | 反例 |
|------|------|------|
| task-id | `checkout` | `flow-02` |
| screen-id | `review-cart` | `screen-final-v3` |
| Frame | `web/checkout/review-cart/empty` | `Web/Page1/Variant` |

### Pass 2 — 语法 / join key（后）

| 种类 | 规则 |
|------|------|
| task-id | `kebab-case`，与 INPUTS 任务短名一致（词来自 Pass 1） |
| screen-id | `kebab-case`，全局唯一 |
| platform | 仅 `web`/`ios`/`android`/`macos`（小写） |
| Figma Frame | `<platform>/<task-id>/<screen-id>/<state>` |
| 矩阵行 | 同一 `screen-id` + 组件名 |
| 实现组件名 | `UI/<Name>/<Variant>`（`<Name>` = 词表） |

`screen-id` 是 flows / screens / matrices / Figma 的 **唯一 join key**。
