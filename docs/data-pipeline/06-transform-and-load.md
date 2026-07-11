# 06 — Transform 与 Load

## 不变量

- Transform 输出必须满足 Dataset 契约（键、必填列、类型）。  
- Load 语义由 INPUTS §4 **互斥钉死**一种主语义；禁止同 Run 混用未声明的多种写策略。  
- Load **可重入**：at-least-once 下重复执行不得重复计数业务事实。

## 步骤规格（实现自写）

### Transform

1. 读 `staging_ref`；清洗、映射、去重、业务规则。  
2. 引擎：  
   - **应用内**（默认）：纯函数优先；I/O 集中在边界。  
   - **dbt**（INPUTS §13）：`dbt run` 针对该 pipeline 模型选择；失败 → `TRANSFORM_FAILED`。  
3. 产出 `framed`（表/文件）供 load；保留行数指标。

### Load

| 语义 | 行为 |
|------|------|
| **append** | 插入新行；须有 **去重键**（业务唯一）或仅追加不可变事件且键含 `run_id` |
| **upsert** | 按 INPUTS 键列冲突更新；重复 load 结果收敛 |
| **replace-partition** | 写新分区/影子表 → verify 通过后原子切换；失败不切流量 |

1. `stage = load`；在 Destination 事务或分区协议内写入。  
2. PG Destination：对齐 [postgres](../postgres/README.md) 事务边界；长事务须 INPUTS 书面超时。  
3. 失败回滚或丢弃未切换分区 → `LOAD_FAILED`。

### 伪代码（规格级）

```text
transform(run, staging) -> framed:
  if engine == app: return map_contract(staging, dataset)
  if engine == dbt: return dbt_run(select=run.pipeline_name)

load(run, framed):
  match semantics:
    append:  insert_idempotent(framed, dedupe_key)
    upsert:  upsert(framed, key_cols)
    replace-partition: write_shadow(framed, run.partition); # switch after verify
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 契约校验失败（缺列/类型） | `TRANSFORM_FAILED`；permanent 若契约错误 |
| dbt 编译/运行失败 | `TRANSFORM_FAILED` |
| 唯一约束意外冲突（append 无去重） | `LOAD_FAILED`；修语义或键 |
| Destination 不可达 | transient |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| upsert 执行两次 | 业务行数不变 |
| replace-partition verify 前 | 对外仍读旧分区 |
| 缺必填列 | transform 失败 |
| append 无去重键 | 规格/INPUTS 拒绝或测试红灯 |
