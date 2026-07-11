# 01 — 栈（钉死）

| 层 | 选择 |
|----|------|
| **对象 API** | **S3 兼容**（PutObject / GetObject / DeleteObject；预签名 Get/Put；可选 Multipart） |
| **本地开发** | **MinIO**（Docker Compose；path-style 或 virtual-host 按 INPUTS 钉死一种） |
| **生产 endpoint** | 任意 S3 兼容实现（自托管 MinIO 或其它）；仅配置 `S3_ENDPOINT` / 凭证，**不**按云百科分叉业务逻辑 |
| **TS / JS 客户端（默认）** | **AWS SDK v3**：`@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` |
| **Go 客户端（默认）** | **minio-go**（`github.com/minio/minio-go/v7`） |
| **Python 客户端（默认）** | **boto3**（`s3` client，endpoint_url 指向兼容服务） |
| **映射学习（非默认）** | minio-js、aws-sdk-go-v2、各云专有 SDK——对照 API，**不**替换上表语言默认 |

禁止：留下「AWS SDK 或 minio-js 任选」开口；生产把云控制台操作手册当应用契约；浏览器内嵌长期密钥。

## 语言 → 客户端（互斥）

实现仓按应用主语言**钉死一行**；跨语言服务各进程各自钉死，禁止同进程双客户端库。

| 应用语言 | 钉死客户端 | 预签名 |
|----------|------------|--------|
| TypeScript / JavaScript | AWS SDK v3 `@aws-sdk/client-s3` | `@aws-sdk/s3-request-presigner` |
| Go | minio-go v7 | PresignedGetObject / PresignedPutObject |
| Python | boto3 | `generate_presigned_url` |
| 其它 | INPUTS 书面：官方 S3 兼容 SDK 名 + 预签名 API | 同左 |

若 INPUTS 书面改选同语言另一主流客户端（例 TS 改 minio-js），须：① 冲突表理由；② 仍映射到本册 Lifecycle；③ **不得**双 SSOT。

## 脚手架

```bash
# 1) 本地 MinIO（Compose）
#    image: minio/minio；命令 server /data --console-address ":9001"
#    建桶：mc mb 或 SDK CreateBucket；默认私有
# 2) 配置 staging/prod：S3_ENDPOINT、S3_REGION、S3_ACCESS_KEY_ID、S3_SECRET_ACCESS_KEY、S3_BUCKET
#    （值不入库；forcePathStyle 按 INPUTS）
# 3) 应用侧：按上表装客户端；实现 Object Put Lifecycle（05）
```

## 版本

| 项 | 策略 |
|----|------|
| MinIO（本地） | 跟 `minio/minio` 当前稳定镜像标签；锁进 Compose |
| AWS SDK v3（TS） | 锁 `@aws-sdk/client-s3` 与 `@aws-sdk/s3-request-presigner` 同代 |
| minio-go | 大版本 **v7** |
| boto3 | 跟应用 Python 锁文件；S3 API 调用面本册钉死 |

## 冲突裁决（写入 sources）

- 云厂商托管流行度 **不**单独定胜负；**S3 兼容 API + 可本地 MinIO 验证**优先。  
- TS 生态 minio-js 可用，但 **默认钉 AWS SDK v3**（与 S3 官方客户端形状一致、预签名一等公民）；改选须 INPUTS。  
- Go 默认 **minio-go**（对 MinIO/兼容 endpoint 摩擦更低）；需要 aws-sdk-go-v2 时 INPUTS 互斥改选。  
