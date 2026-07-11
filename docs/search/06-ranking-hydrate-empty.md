# 06 — 排序、回填与空/错

## 不变量

- 排序信号来自索引（`ts_rank_cd` / 引擎 score / 向量距离）；**禁止**随机序冒充相关度。  
- Hydrate 字段 ⊆ 权威存储；索引冗余字段若返回，须标注为「索引投影」且可被权威覆盖。  
- 空命中与错误码分离（INPUTS §7）。  
- 分页稳定：同 query + 同排序键，翻页不丢不重（允许异步索引下的短暂漂移，须在异步策略下文档化）。

## 步骤规格（实现自写）

1. 计算 rank：FTS 默认 `ts_rank_cd(search_vector, tsquery)`；可选标题权重已在 `03` `setweight`。  
2. 稳定次序：**默认** `ORDER BY rank DESC, id ASC`；若 INPUTS §6 改选则 `ORDER BY rank DESC, created_at DESC, id ASC`（互斥，钉一种）。  
3. Hydrate：`WHERE id = ANY($ids) AND <scope>`；保持步骤 2 的顺序重排。  
4. 截断 snippet（若产品要）：`ts_headline(config, body, query)`；注意超时预算，可裁剪为「仅标题」。  
5. Empty：统一 envelope `{ hits: [], code: "search.empty" }`。  
6. Error：映射表写入应用错误模块；禁止把 empty 记入 error 监控为故障（若接监控=参考）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| hydrate 部分 id 缺失 | 静默跳过；若全部缺失 → empty |
| rank 全相等 | 靠稳定次序 |
| 客户端要「相关度百分比」 | 不提供伪百分比；给原始 score 或省略 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 标题命中 vs 仅正文命中 | 标题权重更高（fixture） |
| empty | code=`search.empty`，HTTP 成功类 |
| 引擎 503 | 非 empty 码 |
| 翻页第二页 | 与第一页 id 无交集（同快照） |
