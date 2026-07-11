# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

授权边界内写入对象存储，校验成功后可授权下载/删除；默认私有桶，浏览器不持长期密钥。

## 核心正确性路径（全文唯一）

**Object Put Lifecycle**：authorize → put/presign → verify → read/delete。规格见 [05](./05-object-put-lifecycle.md)。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST | API 契约写明 S3 兼容 | `01`/`03` |
| F02 | MUST NOT | 同语言双客户端 SSOT | `01` |
| F03 | MUST | 本地默认 MinIO；默认私有桶 | `01`/`03` |
| F04 | MUST NOT | 默认 public-read / 永久公开 ACL | `03` |
| F05 | MUST | 先 authorize 再 put/presign | `04`/`05` |
| F06 | MUST NOT | 浏览器持有长期 Access Key | `06` |
| F07 | MUST | object key 由服务端授权意图决定 | `03`/`06` |
| F08 | MUST NOT | verify 前标「已上传可用」 | `07` |
| F09 | MUST | deletion-first；禁云控制台百科当实现指南 | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| endpoint / 桶 / 区域 / TTL / 客户端语言 | `INPUTS.md` |
| 桶与键契约 | `03` |
| 授权 | `04` |
| Lifecycle | `05` |
| Put/Presign | `06` |
| verify | `07` |
| 读/删 | `08` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
