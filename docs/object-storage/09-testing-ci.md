# 09 — 测试与 CI

## 探针（case → 期望）

| case | 命令 | 期望 |
|------|------|------|
| INPUTS 谓词 | `check-inputs` | exit 0 |
| authorize 拒绝 | `test` | 无预签名 |
| presign put → verify | `test` | StoredObject 可用 |
| 无 verify 标可用 | `test` / 架构 | FAIL |
| verify 类型/大小不符 | `test` | verify_failed；残留策略生效 |
| 私有读他者 | `test` | forbidden |
| owner get / delete | `test` | 可读；删后不可读 |
| 前端长期密钥 | 架构门禁 | 无 `S3_SECRET` 进客户端包 |
| 本地 MinIO | `test` 对 Compose | Lifecycle 绿 |

## 发版矩阵（场景 × 断言）

| # | 场景 | 断言 |
|---|------|------|
| 1 | 授权用户上传允许 MIME | authorize→put→verify ok；可下载 |
| 2 | 未登录 / 无权限上传 | forbidden；桶内无新对象（或无 Intent） |
| 3 | 超大文件 | too_large 或 verify_failed |
| 4 | 错误 Content-Type | denied 或 verify_failed |
| 5 | 他者下载私有对象 | forbidden |
| 6 | 删除后下载 | not_found / 失败 |
| 7 | 预签名过期 | 上传或下载失败 |
| 8 | `check` | exit 0 |

PR：`check`。发版：同 + staging 对真实 endpoint 抽检上传/下载各 1 次（密钥不入库）。
