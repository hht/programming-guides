# 02 — 目录与命名

## 树（钉死）

```text
Dockerfile
compose.yaml
config/
  deploy.yml                 # Kamal（远程时）
.github/
  workflows/
    ci.yml
    release.yml
ops/
  runbook.md
  secrets.names.md
  current-release.txt        # 短 sha；成功后写；可提交
  previous-release.txt       # 短 sha 或 FIRST；可提交
scripts/
  healthcheck.sh             # 目标仓自写；步骤对齐 templates/healthcheck.steps.md
.gitignore                   # 须忽略 .env 真值；release txt 不忽略
```

## 依赖方向

```text
INPUTS → Dockerfile/compose → CI build → Kamal|compose → health → 回滚
```

禁止：`scripts/misc/` 口袋；生产密钥进 git。

## 命名

| 种类 | 规则 |
|------|------|
| 镜像 tag / release 文件 | **短 sha**（`git rev-parse --short HEAD`） |
| 工作流 | `ci.yml` / `release.yml` |
| 密钥名 | `SCREAMING_SNAKE`；跨环境同名 |
| 健康 URL | 见 INPUTS §1b（完整 URL，含 scheme） |
