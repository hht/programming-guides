# 07 — 环境与一致性

## 不变量

- staging 与 production：**同构**（同 compose/Kamal 结构、同密钥名、同健康路径） 
- 仅值不同：主机、密钥值、域名、副本数 
- 禁止「只在 prod 手工改过、staging 没有」的长期漂移 

## 步骤规格

1. **默认单文件**：`config/deploy.yml` 内用 Kamal **destinations**（或等价）区分 staging/production；禁止再平行一套未登记的 yml。 
2. 发 prod 前：staging 同短 sha 已健康通过（INPUTS 豁免须写入 `ops/runbook.md` 一节「豁免」）。 
3. 配置漂移检查：密钥名表 staging/prod 集合相等（值可不同）。 

## 失败分类

| 情况 | 行为 |
|------|------|
| prod 有额外密钥名 | check 失败 |
| 跳过 staging | 仅当 INPUTS 豁免 |

## 探针

| case | 期望 |
|------|------|
| 密钥名表 diff | 空差或已知豁免列表 |
