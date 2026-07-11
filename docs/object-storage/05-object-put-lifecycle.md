# 05 — Object Put Lifecycle（核心）

## 不变量

- 全文唯一核心路径名：**Object Put Lifecycle**。  
- 顺序钉死：**authorize → put/presign → verify → read/delete**。  
- 编号不可跳步；不可把 verify 挪到业务「已上传」之后。  
- 默认私有；浏览器无长期密钥。

## 步骤规格（实现自写）

### 1. authorize

1. 按 [04](./04-authorize.md) 判定主体是否可写入该业务意图。  
2. 产出 `ObjectPutIntent`（bucket、object_key、content_type、max_bytes、expiry…）。  
3. 失败 → `object.forbidden` / `object.content_type_denied` / `object.too_large`；**停止**。

### 2. put / presign

互斥模式由 INPUTS 钉死（默认 **presign put** 用于浏览器；服务端代传用于可信后端任务）：

| 模式 | 行为 |
|------|------|
| **presign put** | 服务端用 SDK 签发短时 PUT URL；客户端对 URL 直传；**不**经应用中转字节（细则 `06`） |
| **server put** | 服务端持流调用 `PutObject`；用于 Worker / 可信服务 |

1. 仅接受步骤 1 的 Intent（或 intent_id）。  
2. 过期 Intent → `object.intent_expired`。  
3. 签发或执行 Put；返回 `presign_url` + `expires_at`，或服务端 Put 的 ETag。

### 3. verify

1. 客户端或服务端声明「上传完成」后，服务端按 [07](./07-verify.md) 对 `bucket/object_key` 做 **HeadObject**（或等价）。  
2. 核对：对象存在；`Content-Type` 匹配 Intent；`Content-Length ≤ max_bytes` 且（若 Intent 声明了精确 size）相等；可选 ETag 记录。  
3. 失败 → `object.verify_failed`；**不得**将业务行标为可用；宜删残留或标记隔离（INPUTS：默认 **删除残留**）。  
4. 成功 → 持久化 `StoredObject` 元数据（key、etag、size、content_type、principal）；业务状态才可「已上传」。

### 4. read / delete

在后续用户动作中（可晚于 Put 会话）：

#### 4a. read

1. 授权读（对称于 `04`，意图改为 get）。  
2. 默认 **presign get**（TTL 默认 **60s**）或服务端流式 Get；禁止把私有对象改成永久公开链当默认。  
3. 细则 [08](./08-read-and-delete.md)。

#### 4b. delete

1. 授权删。  
2. `DeleteObject`；应用元数据标记删除或同事务删行。  
3. 存储删失败 → 可重试；禁止「DB 已删、对象永留」无补偿（至少告警 + 重试路径，INPUTS 可挂 [workers-queue](../workers-queue/README.md)）。

### 伪代码（规格级）

```text
function putObject(principal, intent_req):
  intent = authorize(principal, intent_req)     # 1
  if intent.denied: return forbidden

  if mode == presign:
    url = presignPut(intent)                    # 2
    return { url, expires_at, intent_id }
  else:
    putObject(intent, body)                     # 2
    return verify(intent)                       # 3（服务端可内联）

function completePut(principal, intent_id):
  intent = loadIntent(intent_id)
  authorizeComplete(principal, intent)
  return verify(intent)                         # 3

function readObject(principal, object_ref):
  authorizeGet(principal, object_ref)           # 4a
  return presignGet(object_ref) | streamGet(...)

function deleteObject(principal, object_ref):
  authorizeDelete(principal, object_ref)        # 4b
  DeleteObject(...)
  markDeleted(...)
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| authorize 拒绝 | 4xx；无 URL |
| 预签名过期后上传 | 存储 403/过期；verify 失败 |
| Put 成功但 verify 类型不符 | verify_failed；删残留（默认） |
| 未 verify 就读业务「可用」 | **禁止**；测试红灯 |
| 读未授权 | `object.forbidden`；无 URL |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 快乐路径 presign | authorize→URL→Put→verify ok→可 presign get |
| 无授权 | 无 URL |
| 跳过 verify 标可用 | 架构/单测 FAIL |
| verify 长度超限 | verify_failed；业务未可用 |
| 读他人私有对象 | forbidden |
| 删除后 get | 不存在 / 404 类 |
