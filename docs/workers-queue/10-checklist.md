# 10 — 清单

- [ ] `INPUTS OK`；后端互斥已约定 
- [ ] `01` 栈：PG SKIP LOCKED（默认）或 Redis Streams；未默认采用 BullMQ/Sidekiq 
- [ ] `02` Pass1 词表（队列名 / claim / ack / dead_letter） 
- [ ] `03` 表或流 schema + 唯一幂等约束 
- [ ] `04` 入队（PG 同事务默认） 
- [ ] `05` **Job Lifecycle** 五段步骤 
- [ ] `06` 可见性超时数字 
- [ ] `07` 幂等键必填 + 执行去重 
- [ ] `08` max_attempts + 死信可查 
- [ ] 无 `setTimeout` 伪队列 
- [ ] `commands` `check` 绿 
- [ ] `11` **A+B+D** 
