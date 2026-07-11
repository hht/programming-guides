# 07 — Verify（写入校验）

## 不变量

- Lifecycle **步骤 3**；**verify 成功前**业务不得展示/消费该对象为「已上传可用」。  
- 校验在**服务端**执行（持长期凭证做 HeadObject）；不信任仅客户端「我传完了」。  
- 默认残留策略：**verify 失败 → DeleteObject 清理**（INPUTS 可改隔离前缀，须书面）。

## 步骤规格

1. 加载 `ObjectPutIntent`（intent_id 或签名声明）；校验调用方仍为原 principal（或管理员）。  
2. `HeadObject(bucket, object_key)`（SDK HeadObject / StatObject）。  
3. 断言：  
   - 对象存在（404 → `object.verify_failed`）  
   - `Content-Length` 存在且 `≤ intent.max_bytes`；若 Intent 有精确 `content_length` 则相等  
   - `Content-Type` 等于 Intent（忽略参数时按 INPUTS：默认**精确匹配**主类型）  
   - 可选：魔术字节抽检（PDF `%PDF`、JPEG `FF D8`…）——默认**关**；开启须 INPUTS  
4. 成功：写入应用 `StoredObject`（key、size、content_type、etag、uploaded_at、principal_id）；Intent 标记 completed。  
5. 失败：按残留策略删除或隔离；返回 `object.verify_failed`；业务行保持未上传。

## 与 Put 响应的关系

| 来源 | 可否单独当作 verify |
|------|---------------------|
| 仅客户端 onSuccess | **否** |
| 仅 PutObject 2xx（server put） | 宜再 Head 一次；允许「Put 响应元数据 + 存在性」合成，但须测假阳性 |
| HeadObject 全量核对 | **是**（默认） |

## 失败分类

| 情况 | 码 |
|------|-----|
| 不存在 | `object.verify_failed` |
| 过大 / 类型不符 | `object.verify_failed`（可附 reason） |
| 存储不可用 | `object.bucket_unavailable` |
| Intent 不属于调用方 | `object.forbidden` |

## 单测探针

| case | 期望 |
|------|------|
| 正确上传后 verify | StoredObject 存在；业务可用 |
| 未上传就 complete | verify_failed |
| 上传错误 MIME | verify_failed；残留已删（默认） |
| verify 前 API 返回「已上传」 | FAIL |
