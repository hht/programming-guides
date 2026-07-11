# 04 — Extract（抽取）

## 不变量

- Extract **只读源**（或源系统允许的导出 API）；禁止在 extract 内写 Destination 业务表。 
- 输出进入 **暂存**（对象前缀或 staging schema）；带 `run_id`。 
- 失败可重试；部分写入暂存须可丢弃或按 run_id 隔离清理。

## 步骤规格（实现自写）

1. 将 BatchRun `state → running`，`stage = extract`。 
2. 按 INPUTS §3 连接 Source；应用水位/窗口谓词拉数。 
3. 写入暂存：路径或表名含 `pipeline_name` + `run_id`；记录字节数/行数摘要到 BatchRun。 
4. 源不可达 / 超时 / 鉴权失败 → `EXTRACT_FAILED`（默认 **transient**，除非 4xx 永久鉴权错）。 
5. 成功 → 暂存句柄（URI / staging 表名）交给 transform；**不**标 succeeded。

### 伪代码（规格级）

```text
extract(run, source, watermark) -> staging_ref:
 rows = source.read(since=watermark, window=run.window)
 staging_ref = staging.write(run.id, rows)
 run.metrics.extract_rows = count(rows)
 return staging_ref
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 源超时 / 5xx / 限流 | transient → runner 重试 |
| 凭证无效 / 资源不存在 | permanent → 尽快 dead |
| 空结果 | 允许；须在 verify 声明「允许空」或失败（INPUTS §7） |
| 暂存写失败 | `EXTRACT_FAILED`；不推进水位 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 增量窗口 | 只拉水位之后数据 |
| 源 503 | transient；Run 可 retry |
| 暂存路径含 run_id | 断言路径/表名 |
| extract 写 Destination | 审查/测试禁路径红灯 |
