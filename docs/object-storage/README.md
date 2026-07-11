# Object Storage — S3 兼容对象存储指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **对象上传 / 下载 / 私有桶授权**：先授权，再 put 或预签名，再校验，再读/删。  
> **默认栈**：**S3 兼容 API**；客户端按应用语言钉 **官方/主流 SDK**（TS/JS → **AWS SDK v3** `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`；Go → **minio-go**；Python → **boto3**）；本地开发 **MinIO**。生产 endpoint 可为任意 S3 兼容实现（自托管 MinIO / 其它兼容服务），**禁止**把某云厂商控制台百科当本册正文。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

用户在授权边界内把文件写入对象存储，系统校验写入成功后可在授权下下载或删除；默认私有桶，浏览器不持有长期密钥。

## 核心正确性路径

**Object Put Lifecycle**（[05](./05-object-put-lifecycle.md)）：

`authorize → put/presign → verify → read/delete`（编号步骤）

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；按语言客户端表只读适用节  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md`）  
3. 必读 [03](./03-bucket-and-object-contract.md) + [04](./04-authorize.md) + [05](./05-object-put-lifecycle.md)；落地 [06](./06-put-and-presign.md) / [07](./07-verify.md) / [08](./08-read-and-delete.md)  
4. [commands.md](./commands.md) `check` 绿  
5. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；endpoint / 桶 / TTL / 客户端 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-bucket-and-object-contract.md) | 桶、键、元数据契约 |
| [04](./04-authorize.md) | 上传/下载/删除授权 |
| [05](./05-object-put-lifecycle.md) | **Object Put Lifecycle（核心）** |
| [06](./06-put-and-presign.md) | 直传 Put vs 预签名 |
| [07](./07-verify.md) | 写入后校验 |
| [08](./08-read-and-delete.md) | 读与删 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / env 例 |
