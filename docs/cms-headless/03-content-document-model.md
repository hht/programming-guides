# 03 — ContentDocument 模型

## 不变量

- **ContentDocument**（应用实体）：业务主键或稳定 `slug` + `content_type` + `status` + `locale`（若启用）+ 字段投影 + `cms_document_id`（可空至首次保存）+ `updated_at`。 
- **字段投影**为应用类型（见 [templates/content-document.schema.json](./templates/content-document.schema.json)）；**禁止**把供应商原始 JSON 当页面/领域唯一模型。 
- 状态枚举最小集见 [templates/content-status-matrix.md](./templates/content-status-matrix.md)。

## 步骤规格（实现自写）

1. **约定类型清单**：按 INPUTS §2 为每个 `content_type` 定义必填字段与 slug 规则。 
2. **建模型 / 投影表（可选）**：至少能表达 `id|slug`、`content_type`、`status`、`cms_document_id`、`updated_at`；多 locale 时复合唯一 `(slug, locale)` 或等价。 
3. **投影函数**：`projectFromCms(raw) → ContentDocument`；未知字段忽略或进 `extensions`（INPUTS 择一）；**禁止**静默丢必填。 
4. **禁止**：用 Studio 手工改状态后不经 validate/publish 路径却当已对公开可见；用展示层假数据冒充 Delivery 结果。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| slug 非法 / 空必填 | `CONTENT_VALIDATION_FAILED`；不 publish |
| 投影缺必填 | 拒绝落库投影或标记 invalid；公开 fetch 不返回残缺 published |
| 未知 content_type | 拒保存或 ignore（INPUTS 约定）；默认 **拒** |
| cms_document_id 冲突映射两业务行 | 拒；修映射 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 合法 raw → 投影 | ContentDocument 字段齐全；status 映射正确 |
| 缺必填 raw | 投影失败或 validation 失败 |
| 同 slug 两 locale | 按 INPUTS 唯一约束通过或拒 |
| 供应商多余字段 | 不污染必填；extensions 策略符合 INPUTS |
