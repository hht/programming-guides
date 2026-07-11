# 06 — 授权与配额

## 不变量

- 对应 Lifecycle **步骤 1**；失败则不得 validate/infer。 
- 授权是**应用层**决策；网络隔离（VPC）**不**单独满足本册 authorize（除非 INPUTS §2 勾「内网 + 网关已验」并写明谁验）。 
- 配额与超时独立：未超时也可因配额拒绝。

## Authorize

### 输入 / 输出

| | |
|--|--|
| 输入 | 凭证（头/证书）+ 可选 `model_id` |
| 输出 | `principal_id`（稳定字符串）或拒绝 |
| 拒绝 | `unauthorized`（无法认证）/ `forbidden`（已认证无权限） |

### 步骤规格

1. 抽取凭证；缺省 → `unauthorized`。 
2. 查密钥表 / 会话 / mTLS 映射 → `principal_id`；无效 → `unauthorized`。 
3. 若启用模型 ACL：principal 是否可调用该 `model_id`；否 → `forbidden`。 
4. 不在此步做 schema 深校验（留给步骤 2），避免未授权触发昂贵解析；**允许**读 Content-Length 做超限快拒。

对接 [auth](../auth/README.md) / [saas](../saas/README.md) 时：复用会话与 `tenant_id`；本册词表仍用 `principal_id` 作为配额键（可 = `user_id` 或 `api_key_id`）。

## Quota

### 默认数字（INPUTS 可改）

| 维 | 默认 | 超限码 |
|----|------|--------|
| 并发 in-flight / 主体 | **4** | `inference.quota_exceeded` |
| 速率 / 主体 | **60 / min** | 同左 |
| 全局限流（可选） | 关 | 若开：单独写明数字 |

### 算法（写明语义，实现可换）

1. **速率**：固定窗口或令牌桶（全文一种）；拒绝时**不**占用 in-flight。 
2. **并发**：acquire 成功才进入步骤 2–4；`finally` release；校验失败也必须 release。 
3. 多实例：默认单进程内存配额；水平扩展须在 INPUTS 写明共享后端（Redis 等）——语义仍为本节，**不**开 redis 百科分册。

矩阵例：[templates/timeout-quota-matrix.md](./templates/timeout-quota-matrix.md)。

## 失败分类

| 情况 | 码 | HTTP |
|------|-----|------|
| 无/错密钥 | `inference.unauthorized` | 401 |
| 无模型权限 | `inference.forbidden` | 403 |
| 超并发或超速率 | `inference.quota_exceeded` | 429 |

429 响应宜含 `Retry-After`（秒）；非必勾运维仪表。

## 单测探针

| case | 期望 |
|------|------|
| 坏密钥 | 401；无 infer |
| 好密钥无模型权 | 403 |
| 第 5 个并发（默认 4） | 429 |
| 速率突发超 60/min | 429 |
| 校验失败后 | 槽位释放，下一请求可进 |
