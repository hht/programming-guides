# 10 — 新项目清单

1. [ ] INPUTS 全勾，输出 `INPUTS OK`  
2. [ ] `pnpm create pastel-app`（或手动等价）+ Node ≥22 + pnpm lock  
3. [ ] 目录按 `02`；**Pass1 词表（命令=用户任务）**；依赖方向无违规  
4. [ ] 命令树按 INPUTS 落在 `source/commands/`  
5. [ ] Exit 表写入仓内并与 `domain/exit-codes.ts` 一致  
6. [ ] 核心路径五态 + stdout/stderr 分流  
7. [ ] 非 TTY / CI 行为按 INPUTS  
8. [ ] config 策略 A/B/C 落地；密钥不进日志  
9. [ ] `bin` + `pnpm build` + `--help` 烟测  
10. [ ] `pnpm check` 绿；e2e 矩阵勾选  
11. [ ] `11-world-class-acceptance` 全勾  
