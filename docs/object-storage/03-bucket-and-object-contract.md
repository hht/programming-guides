# 03 — 桶与对象契约

## 不变量

- 桶默认 **private**；对象默认不可匿名读。 
- `bucket` 名须写明在 INPUTS（staging/prod 可同名或分名，但成对环境一致策略须写明）。 
- `object_key` 由 **ObjectPutIntent** 生成或校验，含租户/实体/用途前缀；禁止裸客户端路径当唯一门闸。 
- `Content-Type` 与 `Content-Length`（或上限）在授权时声明，verify 时核对。

## 桶

| 项 | 默认 | 说明 |
|----|------|------|
| ACL / Policy | private | 无公开 List；无默认 public-read |
| 版本控制 | 关（默认） | 开启须 INPUTS + 读删语义书面 |
| 加密 | 服务端默认（若实现支持） | 应用层不发明第二套加密 SSOT，除非 INPUTS |

公开读（CDN 静态等）**非默认**：须 INPUTS「公开前缀」白名单 + 单独 authorize；仍禁止把整桶 public。

## ObjectPutIntent（授权输出）

| 字段 | 必填 | 说明 |
|------|------|------|
| `bucket` | 是 | INPUTS 桶名 |
| `object_key` | 是 | 服务端决定或服务端校验通过的完整键 |
| `content_type` | 是 | 白名单 MIME（INPUTS） |
| `max_bytes` | 是 | 上限；默认 **20 MiB**（INPUTS 可改） |
| `principal_id` | 是 | 授权主体 |
| `purpose` | 是 | 业务用途词（如 `invoice.pdf`） |
| `expires_at` | 预签名时 | 与 TTL 一致 |

Schema 例：[templates/object-put-intent.schema.json](./templates/object-put-intent.schema.json)。

## 键前缀约定（默认）

```text
{tenant_id}/{entity}/{entity_id}/{purpose}/{uuid}
```

- `uuid` 防覆盖；若业务要求幂等覆盖，INPUTS 约定「同 intent 同 key」并写明覆盖策略。 
- 禁止用户可控段出现 `../` 或绝对路径。

## Content-Type 白名单（默认种子）

`image/jpeg` · `image/png` · `image/webp` · `application/pdf` · `text/plain` 

扩展须写入 INPUTS；未知类型 → `object.content_type_denied`。

## 失败分类

| 情况 | 码 |
|------|-----|
| 键非法 / 越前缀 | `object.key_invalid` |
| MIME 不在白名单 | `object.content_type_denied` |
| 超 max_bytes | `object.too_large` |
| 桶不存在 / 配置错 | `object.bucket_unavailable` |
