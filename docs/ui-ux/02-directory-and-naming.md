# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

## 树

```text
design/
 tokens.md # 写 SSOT（须建；Variables 同名镜像）
 flows/
 <task-id>.md # 用户任务（业务名）；与 09 证据路径一致
 screens/
 <screen-id>.md # 目的、主 CTA、内容清单
 matrices/
 <screen-id>.md # 状态矩阵（列=templates 八列）
 handoff.md # 实现清单（见 templates/handoff.md）
 figma-notes.md # file URL、Frame 列表、a11y: PASS（路径固定本文件）
```

## 依赖方向

```text
INPUTS → flows → screens → matrices → figma-notes → handoff → 实现指南
```

禁止：`misc/`、`final-final/` 口袋；无 screen-id 的匿名 Frame。

## 命名

### Pass 1 — 业务语义（必做）

1. 设计仓建 `UBIQUITOUS_LANGUAGE.md`（仓根默认；或 `design/UBIQUITOUS_LANGUAGE.md`，二选一写进 INPUTS §11 备注）。表头写明：`Term | 含义 | 代码/设计符号 | 禁同义词`。 
2. **必收录行（至少）**：`flow` / `screen` / `matrix` / `handoff` / 各 `task-id` / 各 `screen-id`（含义来自 INPUTS）。 
3. **task-id / screen-id** = 用户任务与业务场景（`place-order`、`connect-wallet`），禁 `screen-1`、`page-a`、`temp`、`final`。 
4. Frame、矩阵行、handoff 组件名与实现指南 **同业务词根**；禁设计师口语与工程代号两套。 
5. **Frame `<state>` 与矩阵列**：只允许八列名 `default|hover|pressed|focus|disabled|loading|empty|error`（见 `05`/templates）。业务情境（如「已连接钱包」）写在 **矩阵备注** 或单独组件行的 `default`/`loading` 说明里，**禁止** dual 成第九状态名（禁 `connected`/`state3` 作 Frame 段）。

| 概念 | 正例 | 反例 |
|------|------|------|
| task-id | `checkout` | `flow-02` |
| screen-id | `review-cart` | `screen-final-v3` |
| Frame | `web/checkout/review-cart/empty` | `Web/Page1/connected` |

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
