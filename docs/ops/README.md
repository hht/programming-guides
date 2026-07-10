# Ops 部署运维指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**从零落地世界级门槛的 **应用部署与发布**（非云厂商百科、非 K8s 全集）。  
> **默认栈**：Docker 镜像 + **Docker Compose**（本地/单机）+ **Kamal**（远程发布）+ **GitHub Actions**（CI）+ 密钥不入库。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

把可运行服务安全地发布到目标环境：构建可复现、密钥不泄漏、健康检查过关、失败可回滚。

## 核心正确性路径（全文唯一）

**Release Lifecycle**：`构建镜像 → 配置/密钥注入 → 迁移或预检 → 切换流量/容器 → 健康门闸 → 成功或回滚`。

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)  
3. [03](./03-secrets-and-config.md) / [04](./04-ci-pipeline.md) / [05](./05-release-lifecycle.md)  
4. [06](./06-health-and-rollback.md) / [07](./07-environments.md) / [08](./08-images-and-supply-chain.md)  
5. [commands.md](./commands.md) `check`；发版 `release` 走通 `09` 矩阵  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md)  

## 索引

| 文档 | 用途 |
|------|------|
| INPUTS / 00–11 / commands / sources / templates | 规格与模板 |
