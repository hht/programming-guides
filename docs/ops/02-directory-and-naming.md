# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

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

UI 状态矩阵：本品类默认 **N/A**（部署运维无产品 UI 四态交付）。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`（服务/环境/发布语义）。  
2. **服务名、compose service、Kamal service、runbook 标题** = 产品/业务名（`web`、`api`、`worker-orders`），禁 `app1`、`svc`、`thing`。  
3. 密钥名表达**业务配置用途**（`DATABASE_URL`、`SESSION_SECRET`），禁 `KEY1`/`TEMP_TOKEN`。  
4. runbook 章节按**用户可理解的故障场景**命名（`checkout-timeout`），禁 `fix`/`issue`。

| 概念 | 正例 | 反例 |
|------|------|------|
| compose service | `api` / `web` | `app` / `backend2` |
| runbook 节 | `orders-queue-backlog` | `misc-problems` |
| 密钥 | `STRIPE_WEBHOOK_SECRET` | `SECRET_A` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| 镜像 tag / release 文件 | **短 sha**（`git rev-parse --short HEAD`） |
| 工作流 | `ci.yml` / `release.yml` |
| 密钥名 | `SCREAMING_SNAKE`；跨环境同名（词来自 Pass 1） |
| 健康 URL | 见 INPUTS §1b（完整 URL，含 scheme） |
