# 来源与差距

## P0（≥3）

| 主题 | URL |
|------|-----|
| Amazon S3 API — PutObject（协议语义；非云百科指南） | https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html |
| Amazon S3 API — GetObject / DeleteObject | https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html |
| AWS SDK for JavaScript v3 — S3 client & presigning | https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-creating-buckets.html |
| MinIO — S3 兼容与快速开始 | https://min.io/docs/minio/linux/index.html |

> P0 中的 AWS API 页仅作 **S3 操作语义**；实现以本册 Lifecycle + 兼容 endpoint 为准，**禁止**把控制台/产品百科当应用分叉。

## 标杆 B（开源 P1）

| ID | 仓库 | 等级 | 学什么 | 不学什么 | 品类匹配一句 |
|----|------|------|--------|----------|--------------|
| A | [minio/minio](https://github.com/minio/minio) | P1 | S3 兼容服务、私有桶、本地可跑 | 把 MinIO 运维全集当应用业务；绑死其 Console UX | 本地/自托管 S3 兼容对象存储 |
| B | [aws/aws-sdk-js-v3](https://github.com/aws/aws-sdk-js-v3) | P1 | Put/Get/Delete、presigner、客户端形状 | 绑死 AWS 账号/控制台；抄全服务 SDK | 应用用主流 SDK 访问 S3 API |
| C | [minio/minio-js](https://github.com/minio/minio-js) | P1 | 预签名、桶隐私、上下载用户流 | 钉为 TS 默认（本册默认 AWS SDK v3）；抄其全部 API 面 | JS 客户端完成上传下载 |

映射学习（非 B 共有证据源、不钉默认）：minio-go、boto3、各云「S3 兼容」托管文档 — 仅 endpoint 配置参考，**不**开云百科分册。

## 共有能力切条（用户可感知）

| 能力 | A | B | C | 判定 |
|------|---|---|---|------|
| 上传对象 | ✓ | ✓ | ✓ | **必做** |
| 下载对象 | ✓ | ✓ | ✓ | **必做** |
| 私有桶 / 授权后访问 | ✓ | ✓ | ✓ | **必做** |
| 删除对象 | ✓ | ✓ | ✓ | **必做** |
| 服务端加密 / 复制跨区 / 生命周期策略仪表 | 可 | 可 | 可 | **参考**（不进必勾） |
| 云厂商控制台运维百科 | — | — | — | **禁止**当指南正文 |

> **共有必做**仅上表用户可感知且 ≥2 源证据的能力。authorize-before-put 与强制 verify **不进共有**（示例常省略）→ 见差距表「超越」与 `11` §C。

## 差距表

| 缺口 | 来自 | 类型 | 落入 | 必做 |
|------|------|------|------|------|
| Object Put Lifecycle 编号步骤 | 工程正确性 | 功能 | `05` | 必做 |
| 上传 / 下载 / 删除 | A,B,C | 功能 | `05`/`06`/`08` | 必做 |
| 私有桶授权 | A,B,C | 功能 | `03`/`04`/`08` | 必做 |
| 预签名 Put/Get | B,C + P0 | 工程 | `06`/`08` | 必做（浏览器路径） |
| authorize 先于 put（非共有） | 超越 a1 | 工程 | `04`/`05` | 超越（指南硬） |
| verify 后才业务可用（非共有） | 超越 a2 | 工程 | `07`/`09` | 超越（指南硬） |
| 本地 MinIO | A + P0 | 工程 | `01`/INPUTS | 必做 |
| 云监控 / 厂商 Console | — | 参考 | — | 参考；禁当正文 |

## 冲突

| 冲突 | 裁决 |
|------|------|
| 某云托管下载量更大 | **不**开云百科本；钉 **S3 兼容 API** + endpoint 配置 |
| TS：minio-js vs AWS SDK v3 | **默认 AWS SDK v3**（预签名一等、与 S3 客户端形状一致）；minio-js = 映射学习 / INPUTS 改选 |
| Go：minio-go vs aws-sdk-go-v2 | **默认 minio-go**；改选须 INPUTS |
| 示例常跳过授权 / verify | **本指南硬要求**两步；写入超越 |
| 默认公开桶「省事」 | **禁止** |
| 浏览器塞 Access Key | **禁止** |
