# 06 — 草稿与校验

## 不变量

- **draft** = 可编辑、默认可预览、**不可**经公开 Delivery 消费。  
- **validate** = publish 的硬门闸；失败不得 publish。  
- 校验规则以 INPUTS §6 为 SSOT；适配器可叠加供应商校验，但**不能放宽**本地必填。

## 步骤规格（实现自写）

1. **saveDraft**：写字段快照；更新 `updated_at`；status 保持/回到 `draft`。  
2. **validate 规则最小集**（须实现）：  
   - 必填字段非空（按 content_type）  
   - slug 格式与唯一（作用域：全局或 per-type / per-locale — INPUTS 钉）  
   - 引用完整性（悬空引用策略按 INPUTS）  
   - （可选）富文本/HTML 消毒策略书面  
3. **错误形状**：`ValidationIssue[]`（见 [templates/validation-issue.schema.json](./templates/validation-issue.schema.json)）；message 可 i18n，**code 稳定**。  
4. **禁止**：仅靠 CMS UI 红框当唯一校验；跳过 validate 的「强制发布」后门（除非 INPUTS 书面 break-glass + 审计）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 必填缺失 | `CONTENT_VALIDATION_FAILED`；列出 path |
| slug 冲突 | 同码 + issue code `SLUG_CONFLICT` |
| 悬空引用且策略=拒 | validate 失败 |
| 悬空引用且策略=允许+告警 | validate ok + warning 列表（不得默认为静默） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 缺标题 | validate 失败；不可 publish |
| 合法草稿 | validate ok |
| slug 冲突 | 失败；原 published 不受影响 |
| 仅供应商通过、本地必填缺 | 仍失败 |
