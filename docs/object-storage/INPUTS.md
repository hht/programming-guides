# INPUTS — 缺则停

任一项缺失 → 列缺口并**停止写对象存储实现**。 
**禁止**空「其它」：凡写「其它」须带书面理由 + 可验收谓词（URL / 桶名 / P0）。

## 必填

| # | 项 | 验收 |
|---|-----|------|
| 1 | **应用语言（择一）** | □ TypeScript/JavaScript □ Go □ Python □ 其它（书面 SDK 名）— 决定 `01` 客户端行 |
| 2 | **S3 兼容 endpoint** | staging/prod **成对** `S3_ENDPOINT`（本地可 `http://127.0.0.1:9000`）；**值策略须写明**；密钥**不入库** |
| 3 | **凭证** | 成对 `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`（或实现仓等价名）；仅服务端 |
| 4 | **桶名** | `S3_BUCKET` 写明；默认 **private**；禁止默认 public-read |
| 5 | **区域** | `S3_REGION`（MinIO 常用 `us-east-1` 占位）；写明字符串 |
| 6 | **寻址风格** | □ path-style（**本地 MinIO 默认**）□ virtual-hosted — 互斥；对应 `S3_FORCE_PATH_STYLE` |
| 7 | **Put 模式（主路径）** | □ **presign put**（浏览器默认）□ **server put**（Worker 默认）— 主 call site 选定一种 |
| 8 | **预签名 TTL** | Put 默认 **300s**；Get 默认 **60s**；改则写入秒数 |
| 9 | **大小上限** | `max_bytes` 默认 **20 MiB**（20971520）；改则约定字节数 |
| 10 | **Content-Type 白名单** | ≥1 MIME；默认种子见 `03`；扩展写入本项 |
| 11 | **错误码表** | 至少：`object.forbidden` / `object.content_type_denied` / `object.too_large` / `object.intent_expired` / `object.verify_failed` / `object.not_found` / `object.presign_failed` / `object.bucket_unavailable` / `object.delete_failed` |
| 12 | **环境成对** | staging/prod：`APP_ENV`、endpoint、bucket、凭证名一致 |
| 13 | **应用册对接** | □ go □ fastapi □ nextjs □ react □ 多册 — 本册为 Object Put Lifecycle SSOT |
| 14 | **本地 MinIO** | Compose 服务可起；与 `test` 探针使用同一 endpoint 策略 |

## 若适用

| # | 项 | 何时 |
|---|-----|------|
| 15 | **客户端改选** | 同语言不用 `01` 默认 SDK：书面理由 + 单一替代库名（禁双 SSOT） |
| 16 | **Intent 持久化** | **默认** DB 存 intent_id；若无状态预签名：书面核对策略（仍须 verify） |
| 17 | **verify 残留** | **默认删除**；改隔离前缀须写明前缀规则 |
| 18 | **Multipart** | 仅当单对象常 > **100 MiB**；约定阈值与 part size |
| 19 | **公开读前缀** | 非默认；白名单前缀 + 单独 authorize |
| 20 | **存在性泄漏策略** | 无权限：**默认** `object.forbidden`；有权缺失：`object.not_found` |
| 21 | **删补偿** | 存储/DB 不一致时：□ 同步重试 □ workers-queue Job（链到该册） |
| 22 | **禁止清单确认** | 勾选：□ 浏览器无长期密钥 □ 无默认公开桶 □ 不以云百科分叉业务 |

## 语言裁剪

| 语言 | 必读 | SDK |
|------|------|-----|
| TS/JS | 01–08 | AWS SDK v3 client-s3 + s3-request-presigner |
| Go | 01–08 | minio-go v7 |
| Python | 01–08 | boto3 s3 client |

## 门闸

```text
INPUTS OK
```

否则：`INPUTS BLOCKED: <缺口列表>`
