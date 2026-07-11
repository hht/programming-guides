# 10 — 开工清单

1. [ ] [INPUTS.md](./INPUTS.md) 全勾 → `INPUTS OK`（含租户模型 / 计费裁剪） 
2. [ ] 目标仓 `UBIQUITOUS_LANGUAGE.md` 含 `02` Pass1 词表 
3. [ ] [01](./01-stack.md) 栈；Postgres 迁移对齐 `03`（RLS 或 schema-per 书面） 
4. [ ] 落地 Membership + Role + Permission（`04`） 
5. [ ] 对接 [docs/auth](../auth/README.md) Session Gate 
6. [ ] 实现 **Tenant Gate Lifecycle**（`05`）于所有租户作用域入口 
7. [ ] 租户解析 + Membership 校验（`07`）；禁仅子域名信任 
8. [ ] 计费状态机（`06`）或 INPUTS N/A 裁剪 
9. [ ] 审计最小集（`08`） 
10. [ ] [09](./09-testing-ci.md) 单测 + 发版矩阵（适用行）绿 
11. [ ] [commands.md](./commands.md) `check` exit 0 
12. [ ] [11](./11-world-class-acceptance.md) **A+B+D** 勾选（非 C） 
