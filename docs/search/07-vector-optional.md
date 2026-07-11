# 07 — 向量检索（可选能力）

> **默认不做。** 仅当 INPUTS §10 勾选「做」时本章必读；否则整章裁剪，acceptance 写「裁剪：未启用向量」。

## 不变量

- 向量是**附加召回**，不替换 `05` 主路径；混合检索须写明融合规则。 
- 扩展：`CREATE EXTENSION vector`（pgvector）；列类型 `vector(D)`，D=INPUTS 维度。 
- 嵌入模型与维度变更 = 全量重嵌 + 迁移，禁止静默截断。 
- **不写**模型训练、微调、数据集百科；只写「调用已选嵌入 API/服务 → 存向量 → 查询」。

## 步骤规格（实现自写）

1. INPUTS §10：模型、维度、度量（默认 **cosine** ↔ `vector_cosine_ops`）。 
2. 迁移：列 + 索引（默认 **HNSW**；小数据可用 ivfflat，须写选因）。 
3. 写路径：权威文档变更 → 异步/同步生成 embedding → 更新列（同步策略对齐 `04`）。 
4. 查询：`parse` 得到 text → 嵌成 query vector → scope 内 `ORDER BY embedding <=> $q`（或对应算子）LIMIT K。 
5. 混合（若启用）：默认 **cascade**（FTS 有命中则只用 FTS；FTS empty 再向量）。**仅**当 INPUTS §10 书面勾选 `rrf/加权` 并写公式与权重时改用该路径；禁止未文档化隐式混合。 
6. 仍须走 `authorize scope`；向量召回不得绕过可见性。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 嵌入服务失败 | `unavailable`；可降级纯 FTS（INPUTS 勾选是否允许降级，默认 **允许并标记 degraded**） |
| 维度不匹配 | 启动/写入失败，禁自动 pad |
| 未启用本章却调用 | 编译/配置期拒绝 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 已知近邻 fixture | 进 Top-K |
| 跨 scope 近邻 | 不出现 |
| 降级开关 | 嵌入挂时仍返回 FTS 或明确 unavailable |
