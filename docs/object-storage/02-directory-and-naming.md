# 02 — 目录与命名

> 命名强制块：[naming-business-first.md](../meta/naming-business-first.md)。**Pass 1 业务语义先于 Pass 2 语法。**

```text
src/                          # 或应用册约定根
  features/
    <entity>-object/          # 按业务实体分目录，禁 storage-utils 大口袋
      authorize-object.*      # 步骤 1：授权 → ObjectPutIntent
      put-or-presign.*        # 步骤 2：直传或签发预签名
      verify-object.*         # 步骤 3：Head/Get 元数据校验
      read-object.*           # 步骤 4a：授权下载 / 预签名 Get
      delete-object.*         # 步骤 4b：授权删除
      object-errors.*         # 错误码
  shared/                     # 可选：S3 客户端单例构造（非领域名 StorageManager）
    s3-client.*               # endpoint + 凭证装配；禁业务 ACL
```

依赖方向：`authorize → put/presign → verify → read|delete`；禁 UI 直持长期密钥；禁 features 互相倒依赖。

UI 状态（若有上传控件）：至少 `idle | authorizing | uploading | verifying | ready | error`；矩阵见 `templates/ui-state-matrix.md`。

## 命名

### Pass 1 — 业务语义（必做）

1. 目标仓建 `UBIQUITOUS_LANGUAGE.md`（Term / 含义 / 代码符号 / 禁同义词）。  
2. **实体 + 对象动作** = 目录与函数词根：`avatarObject`、`invoicePdfPut`，禁 `StorageManager`、`handleUpload`、`S3Service`、`*Dto`。  
3. 协议字段冻结：`bucket`、`object_key`、`content_type`、`content_length`、`etag`、`presign_url`、`presign_expires_at` 与词表一致。  
4. 一词一义：`ObjectPutIntent`（授权后的写入意图）≠ `StoredObject`（verify 通过后的业务可用对象）。

| 概念 | 正例 | 反例 |
|------|------|------|
| 能力目录 | `features/invoice-object/` | `features/s3-manager/` |
| 授权 | `authorizeObjectPut` | `handleUpload` / `checkPerm` |
| 预签名 | `presignObjectPut` | `getTempLink` / `makeUrl` |
| 校验 | `verifyObjectPut` | `confirmUpload` / `processFile` |
| 读 | `readObject` / `presignObjectGet` | `downloadFromS3` |
| 删 | `deleteObject` | `removeFile` / `cleanup` |

### Pass 2 — 语法（后）

| 种类 | 规则 |
|------|------|
| TS/Go 导出 | `camelCase` 函数；类型 `PascalCase` |
| 环境变量 | `S3_*` / `OBJECT_*` `SCREAMING_SNAKE` |
| 对象键 | 路径段 `/`；小写 kebab 或 INPUTS 钉死；禁空格 |
| 错误码 | `object.<case>`，与 INPUTS 错误码表对齐 |
| HTTP 路径（若暴露） | **默认** `/objects/<entity>/presign-put`、`/objects/<entity>/verify`；或 INPUTS 改选单一前缀（互斥钉一种） |
