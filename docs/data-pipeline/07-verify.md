# 07 — Verify（校验门闸）

## 不变量

- **Verify 是成功的唯一定义之一**：与「四步跑完」绑定；缺 verify 不得 `succeeded`。 
- INPUTS §7 清单 **全部**通过才提交水位 / 切换分区 / 对外可用。 
- 每条 Check 有名字、断言、失败码；结果写入 BatchRun（或 `batch_run_checks`）。

## 步骤规格（实现自写）

1. `stage = verify`。 
2. 按清单执行，至少覆盖（按 Dataset 适用裁剪，但不得裁到 0）： 

| 类型 | 例 |
|------|-----|
| 行数 | `count >= 1` 或相对源行数偏差 ≤ INPUTS 阈值 |
| 空集策略 | 允许空 / 禁止空 |
| 主键唯一 | `count(*) = count(distinct key)` |
| 非空列 | 必填列 null 数 = 0 |
| 参照 / 业务 | 自定义 SQL 或纯函数断言 |

3. dbt 若启用：可把 `dbt test` 映射为 VerifyCheck；**仍须**在应用侧记录通过/失败。 
4. 汇总：任失败 → `VERIFY_FAILED`；全过 → 返回 ok。 
5. 成功路径副作用（仅此时）：`commit_watermark`；`replace-partition` 切换；`state = succeeded`。

### 伪代码（规格级）

```text
verify(run) -> results:
 results = []
 for check in input_checks(run.dataset):
 results.append(run_check(check, run))
 return results

finalize(run, results):
 if any_failed(results):
 mark_failed(run, VERIFY_FAILED); return
 commit_watermark(run)
 publish_partition_if_any(run)
 mark_succeeded(run)
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| Check 失败 | `VERIFY_FAILED`；默认可 retry（数据延迟）；INPUTS 可约定 permanent |
| Check 执行超时 | transient |
| 无 Check 清单 | INPUTS 未 OK；禁止上线 |
| 只跑 test 不记录 | 禁；须落库可查 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 主键重复 | verify 失败；state≠succeeded |
| 全部通过 | succeeded；水位前进 |
| 跳过 verify | 红灯 |
| 失败后重跑通过 | 最终 succeeded；无重复副作用 |
