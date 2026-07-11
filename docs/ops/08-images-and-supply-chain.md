# 08 — 镜像与供应链

## 不变量

- 多阶段构建；最终镜像非 root 
- 基础镜像约定 digest 或明确 minor；定期升级 
- CI action 约定 commit SHA 
- 不把密钥 bake 进镜像层 

## 步骤规格

1. `Dockerfile`：builder → runtime；`USER` 非 root。 
2. `.dockerignore` 排除 `.env`、密钥、无关大目录。 
3. 扫描（可选）：`docker scout` / Trivy 在 CI；失败策略默认 **warn**，INPUTS 可升 **fail**。 
4. 发布记录 digest。 

## 失败分类

| 情况 | 行为 |
|------|------|
| 镜像含 `.env` | 重建；check 教程禁止 |
| 以 root 跑 | 不通过评审 |

## 探针

| case | 期望 |
|------|------|
| `docker history` 无密钥文件 | PASS |
| 进程 uid | ≠0 |
