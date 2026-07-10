# 来源、标杆与差距表

## P0

| 主题 | URL |
|------|-----|
| Twelve-Factor | https://12factor.net/ |
| Docker 多阶段 | https://docs.docker.com/build/building/multi-stage/ |
| Compose 规范 | https://docs.docker.com/compose/ |
| GitHub Actions 安全 | https://docs.github.com/en/actions/security-guides |
| Kamal 文档 | https://kamal-deploy.org/ |

## 标杆 \(B\)（3 开源）

| ID | 仓库 | 品类匹配 | 学什么 | 不学什么 |
|----|------|----------|--------|----------|
| A | [basecamp/kamal](https://github.com/basecamp/kamal) | 应用远程部署 | 部署/回滚/配件 | 绑死 Rails |
| B | [docker/compose](https://github.com/docker/compose) | 声明式多容器 | 本地/单机编排 | 当唯一生产编排 |
| C | [actions/starter-workflows](https://github.com/actions/starter-workflows) | CI 工作流模式 | CI/CD 骨架 | 照抄无关语言 |

## 能力切条 → 共有

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 容器化 | ✓ | ✓ | ✓ | 必做 |
| CI 构建发布 | ✓ | ✓ | ✓ | 必做 |
| 声明式部署 | ✓ | ✓ | ✓ | 必做 |
| 配置密钥分离 | ✓ | ✓ | ✓ | 必做 |
| 健康/可用性 | ✓ | ✓ | ✓ | 必做 |
| 回滚/版本 | ✓ | ✓ | ✓ | 必做 |

## 差距表

| 缺口 | 落入 | 必做 |
|------|------|------|
| 健康门闸硬停 | `05`/`06` | 必做（超越） |
| PREV 回滚默认 | `05`/`06` | 必做（超越） |
| Action 钉 SHA | `04`/`08` | 必做 |
| APM | — | 参考 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| 默认上 K8s | **Compose+Kamal**；K8s DEFER |
| latest 标签 | prod 须 sha/digest |
