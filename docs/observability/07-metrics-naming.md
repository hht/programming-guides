# 07 — Metrics 命名与基数

## 不变量

- 每条 metric **先登记再发射**（INPUTS §6 / 实现仓表）；禁临时无表打点进生产默认。  
- **Label 白名单** + **基数上限**；无界维（原始 `user_id`、完整 URL、邮箱）**禁**作 label。  
- 优先 OTel 语义名（如 `http.server.request.duration`）；自定义名稳定、低基数。

## 步骤规格（实现自写）

1. **登记**  
   - 字段：`name`、`type`（counter / updowncounter / histogram / gauge）、`unit`、`labels[]`、`cardinality_budget`（估计时间序列上限）、`owner_feature`。  
   - 可对齐 [templates/metrics-registry.schema.json](./templates/metrics-registry.schema.json)。  
2. **命名**  
   - OTel 约定优先；自定义：`{domain}.{operation}.{thing}` 或词表钉死一种；**禁**同义双名。  
3. **打点**  
   - 仅从登记表创建 Instrument；label 值 ∈ 枚举或有界集（HTTP method、status class、route 模板）。  
4. **与 correlation**  
   - **默认不把 `correlation_id` 当 label**；关联走 logs/traces（生命周期步骤 3）。  
5. **导出**  
   - 经 OTLP Periodic Reader（或等价）；端点 INPUTS §4。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 未登记 metric | CI/探针失败 |
| label 含 user_id | 拒绝或测试红 |
| 超 cardinality_budget | 告警/拒绝新维；须改设计 |
| INPUTS 勾「仅 metrics」 | **非法裁剪** → `INPUTS BLOCKED`；关联验收不得改写为「仅仪表盘」 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 登记内 counter +1 | 导出/收集可见 |
| 非法高基数 label | 不出现在导出或创建失败 |
| HTTP duration histogram | 用 route 模板非 raw URL |
