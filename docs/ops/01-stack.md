# 01 — 默认栈（钉死）

## 选栈总则

先进且可映射：不可变镜像 + 声明式部署 + CI 门禁 > 「手工 SSH 改文件」。  
**禁止**默认上完整 K8s 百科（路线图 DEFER）；单机/小集群用 Compose + Kamal。

## 栈表

| 层 | 选择 | 备注 |
|----|------|------|
| 容器 | **Docker** 多阶段构建 | 非 root 用户运行 |
| 本地/单机编排 | **Docker Compose** | compose.yaml |
| 远程发布 | **Kamal** | SSH 到主机；滚动/代理 |
| CI | **GitHub Actions** | PR check + main 发版 |
| 密钥 | GitHub Secrets + 主机 env | 禁提交 `.env` 真值 |
| IaC 云资源 | **可选** OpenTofu；默认 N/A | 有云资源才开 |

## 远程 vs 本地（钉死）

| INPUTS §3 | 发布器 |
|-----------|--------|
| 本地 only | 仅 Compose；`release`=`compose up` + health |
| Kamal 目标主机 | Kamal 为远程 SSOT；Compose 仍用于本地 |

禁止同一环境混用「手工 docker run」与 Kamal 而不写进 runbook。

## 脚手架

1. 应用仓加 `Dockerfile` + `compose.yaml` + `.github/workflows/`。  
2. Kamal：`kamal init` 后按 INPUTS 填 `config/deploy.yml`（实现自写）。  
3. 版本：…；脚手架须含 `02` 树中 `ops/` 与 workflows 落点。

## 冲突

| 流行 | 本指南 | 理由 |
|------|--------|------|
| 裸机 systemd 无容器 | 不用作默认 | 难复现 |
| 完整 K8s | DEFER | 超出本册范围 |
| 最新 action `@v4` 浮动 | **钉 SHA** | 供应链 |
