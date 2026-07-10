# 03 — 密钥与配置

## 不变量

- 仓内：`secrets.names.md` + `env.example`（空值）  
- 运行时：从环境变量注入；Compose `env_file` 仅本地且 gitignore  
- CI：GitHub Secrets / Environments  

## 步骤规格

1. 列出 INPUTS §5 全表 → `ops/secrets.names.md`。  
2. 应用只读 `os.environ` / 框架 env；缺必填密钥 → **启动失败**（非空跑）。  
3. staging/prod：**同名密钥、不同值**（INPUTS §5 钉死；禁止前缀分叉）。  
4. 轮换：改 Secrets → 重新部署；禁止「只改服务器文件不重发版」作为默认。  

## 失败分类

| 情况 | 行为 |
|------|------|
| 缺密钥 | 容器 exit ≠0 |
| 密钥进 git | check 失败（扫描或评审门禁） |

## 探针

| case | 期望 |
|------|------|
| 空 `DATABASE_URL` | 启动失败 |
| `git grep` 假密钥模式 | 无真实私钥块 |
