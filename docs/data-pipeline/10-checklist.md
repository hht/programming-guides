# 10 — 清单

- [ ] `INPUTS OK`；执行模式 / Runner 互斥已约定 
- [ ] `01` 栈：batch + workers-queue 默认；未默认采用 Airflow/Dagster 
- [ ] `02` Pass1 词表（pipeline / Dataset / BatchRun / 四步名） 
- [ ] `03` BatchRun + 水位 schema 
- [ ] `04` extract → 暂存（含 run_id） 
- [ ] `05` **Batch Job Lifecycle** 四步 
- [ ] `06` transform + load 语义可重入 
- [ ] `07` VerifyCheck ≥1；失败不得 succeeded 
- [ ] `08` runner 对接；条件编排/流式仅按勾选 
- [ ] 无裸 cron 伪管线 
- [ ] `commands` `check` 绿 
- [ ] `11` **A+B+D** 
