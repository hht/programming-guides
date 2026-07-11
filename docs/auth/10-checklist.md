# 10 — 开工清单

1. [ ] [INPUTS.md](./INPUTS.md) 全勾 → `INPUTS OK`（含模式裁剪） 
2. [ ] 目标仓 `UBIQUITOUS_LANGUAGE.md` 含 `02` Pass1 词表 
3. [ ] [01](./01-stack.md) 栈与应用册一致；会话存 PG（或已声明 redis 就绪） 
4. [ ] 迁移：sessions 表对齐 [templates/session.schema.json](./templates/session.schema.json)（模式 D 可 N/A） 
5. [ ] 实现 Login / Logout（按模式） 
6. [ ] 实现 **Session Gate Lifecycle**（`05`）于所有受保护入口 
7. [ ] CSRF（模式 A/B/C）；OAuth（模式 B/C）PKCE 
8. [ ] API/机器 JWT 仅按 `06`；浏览器无 localStorage 主会话 JWT 
9. [ ] [09](./09-testing-ci.md) 单测 + 发版矩阵（适用行）绿 
10. [ ] [commands.md](./commands.md) `check` exit 0 
11. [ ] [11](./11-world-class-acceptance.md) **A+B+D** 勾选（非 C） 
