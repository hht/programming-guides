# 04 — 授权（authorize）

## 不变量

- Object Put Lifecycle **步骤 1**；失败则**不得**进入 put/presign。 
- 下载与删除各有对称授权（见 `08`）；本文件以 **Put** 为主，Read/Delete 复用同一主体模型。 
- 授权是**应用层**决策（会话 / 成员 / 租户）；对象存储 ACL **不**替代应用 authorize。

## 输入 / 输出

| | |
|--|--|
| 输入 | 认证主体（或拒绝匿名）+ 业务意图（entity、entity_id、purpose、声明的 content_type、声明的 size） |
| 输出 | `ObjectPutIntent`（见 `03`）或拒绝 |
| 拒绝 | `object.forbidden`（403）；**不**签发预签名、**不**代传 |

## 步骤规格

1. 解析主体：未登录且意图非公开上传 → `forbidden`（默认禁止匿名 Put）。 
2. 业务门闸：主体是否可对 `entity_id` 写入该 `purpose`（例：仅 owner / 某 RBAC）。对接 [auth](../auth/README.md) / [saas](../saas/README.md) 时复用其会话与租户上下文，**本册不另造登录**。 
3. 校验声明：`content_type` ∈ 白名单；`size ≤ max_bytes`。 
4. 生成 `object_key`（`03` 前缀规则）与 `expires_at`（若走预签名：`now + PRESIGN_PUT_TTL`，默认 **300s**）。 
5. 持久化可选：把 Intent 记入应用 DB（intent_id、key、principal、expiry）供 verify 对照；**默认推荐**（INPUTS 可书面裁成无状态预签名+签名声明，但 verify 仍须能核对 key/type/size）。

## 与存储凭证的边界

| 角色 | 持有 |
|------|------|
| 服务端 | 长期 Access Key（环境变量）；仅服务端进程 |
| 浏览器 / 移动端 | **仅**短时 `presign_url` 或经 API 的代理流 |
| 预签名 | 绑定 method + bucket + key +（可选）headers；过期失效 |

## 单测探针

| case | 期望 |
|------|------|
| 无会话 Put | `object.forbidden`；无预签名 |
| 无权限实体 | `object.forbidden` |
| 合法主体 | 得到 Intent；key 含租户/实体前缀 |
| MIME 不在白名单 | `object.content_type_denied` |
| size > max | `object.too_large` |
