# 06 — Put 与预签名

## 不变量

- 本文件细化 Lifecycle **步骤 2**；不替代 `05`。  
- 浏览器默认 **presign put**；Worker/可信服务默认 **server put**。  
- 预签名 TTL 必须钉死数字（INPUTS）；过期不可用。

## 模式互斥（INPUTS 钉死主路径）

| 模式 | 适用 | 禁止 |
|------|------|------|
| **presign put**（默认·浏览器） | 大文件、省应用带宽 | 把预签名 TTL 设成「永久」；把密钥发给前端 |
| **server put**（默认·Worker） | 可信后端、小文件、需同步扫描 | 浏览器经应用无限制中转超大 body（须钉 max） |

同一产品可两种都实现，但**每个 call site** 钉死一种；禁止「有时随便」。

## Presign Put 规格

1. 输入：有效 `ObjectPutIntent`。  
2. SDK：  
   - TS：`@aws-sdk/s3-request-presigner` + `PutObjectCommand`  
   - Go：`PresignedPutObject`  
   - Python：`generate_presigned_url('put_object', ...)`  
3. 绑定：`Bucket`、`Key`；宜绑定 `Content-Type`（客户端 PUT 必须带相同头）。  
4. `Expires` = INPUTS `PRESIGN_PUT_TTL_SECONDS`（**默认 300**）。  
5. 输出：`presign_url`、`expires_at`、必填请求头表（至少 `Content-Type`）。  
6. 客户端：`HTTP PUT` 到该 URL，body = 文件字节；成功 2xx 后调应用 **complete/verify**。

## Server Put 规格

1. 输入：Intent + 可读 body（流）。  
2. 调用 `PutObject`：`ContentType`、`ContentLength`（可知时）、body。  
3. 捕获 `ETag`；立即进入 `07` verify（可 Head 复核或信任 Put 响应 + Head）。

## Multipart（可选）

- 仅当 INPUTS 声明单对象常 **> max_bytes 直传阈值**（默认阈值 **100 MiB**）时启用。  
- 仍先 authorize；CompleteMultipart 后走 **同一 verify**。  
- 未达阈值 **禁止**为炫技引入 multipart。

## 失败分类

| 情况 | 码 |
|------|-----|
| Intent 过期 | `object.intent_expired` |
| 预签名签发失败（凭证/endpoint） | `object.presign_failed` |
| 客户端 PUT 非 2xx | 客户端重试或中止；服务端 verify 将失败 |
| 强制 path-style 与 endpoint 不匹配 | 配置错误；本地 MinIO 常见，INPUTS 钉 `S3_FORCE_PATH_STYLE` |

## 单测探针

| case | 期望 |
|------|------|
| 预签名未过期 Put | 2xx；随后 verify 可过 |
| TTL 后 Put | 失败；verify_failed |
| Content-Type 与 Intent 不一致 | verify 失败（或存储拒） |
| 前端出现长期 Secret | 架构门禁 FAIL |
