# 00 — 原则与不变量

## 品类

用户在授权边界内把文件写入对象存储，系统校验写入成功后可在授权下下载或删除；默认私有桶，浏览器不持有长期密钥。

## 核心正确性路径（全文唯一）

**Object Put Lifecycle**：**authorize → put/presign → verify → read/delete**。规格见 [05](./05-object-put-lifecycle.md)。授权细节见 `04`；put/预签名见 `06`；校验见 `07`；读删见 `08`——**不替代**本路径名。

## 硬不变量

1. **API 契约写明 S3 兼容**：PutObject / GetObject / DeleteObject /（可选）CreateMultipartUpload 族；禁止发明第二套私有上传协议当 SSOT。 
2. **客户端按语言约定官方/主流 SDK**（见 `01`）；禁止同一语言双客户端 SSOT。 
3. **本地开发默认 MinIO**（Compose）；staging/prod 用 S3 兼容 endpoint（可仍是 MinIO 或其它兼容实现）。 
4. **默认私有桶**：禁止默认 `public-read` / 永久公开 ACL；公开读须在 INPUTS 写明 + 单独路径。 
5. **先 authorize 再 put/presign**：未授权不得签发预签名、不得服务端代传。 
6. **浏览器 / 不可信客户端不得持有长期 Access Key**；短时预签名或服务端代理 Put。 
7. **Object key 由服务端授权意图决定**（前缀/租户/实体维度）；禁止客户端任意选任意 key 作为唯一控制。 
8. **verify 成功前不得把业务状态标为「已上传可用」**（见 `07`）。 
9. **deletion-first**：无第二套对象存储产品并行 SSOT；无 `*StorageManager` 领域主名（见 `02`）。 
10. **禁止**把某云控制台/服务百科当本册实现指南；云厂商文档仅可作 S3 API 语义 P0，不进必勾运维第三方。

## SSOT 表

| 真相 | Owner |
|------|--------|
| endpoint / 桶名 / 区域 / TTL / 客户端语言表 | `INPUTS.md` |
| 桶隐私与键前缀契约 | `03-bucket-and-object-contract.md` |
| 授权谓词 | `04-authorize.md` + 应用 auth 册 |
| Lifecycle 步骤 | `05-object-put-lifecycle.md` |
| Put vs Presign | `06-put-and-presign.md` |
| 校验谓词 | `07-verify.md` |
| 读 / 删 | `08-read-and-delete.md` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md`（Pass1 种子见 `02`） |

## 禁止

- 指南仓堆可运行上传业务模块 
- 浏览器硬编码长期密钥 
- 默认公开桶 
- 无 authorize 的预签名签发 
- verify 失败却标记上传成功 
- 「AWS 或 MinIO SDK 任选」双开口（须按语言表或 INPUTS 互斥任选） 
- 以云厂商产品百科替代本册 Lifecycle 

## 超越（对照写入 11）

1. `对照：B 中常见「直接 Put / 示例跳过授权」或客户端自选 key → 本指南要求 authorize 先于 put/presign，且 object key 由服务端授权意图决定（见 04/05）` 
2. `对照：B 中更弱/未见「写入后强制 verify 才提交业务已上传」→ 本指南要求 verify 成功前不得标业务可用，并有探针（见 07/09）` 
