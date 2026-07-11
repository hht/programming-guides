# 04 — Authz 与频道

## 不变量

- **连接鉴权 ≠ 频道授权**。默认：**每次 `subscribe` 独立 authz**（INPUTS §7）。 
- 频道名必须匹配 INPUTS 频道命名表；否则 `SUBSCRIBE_REJECTED`。 
- 私有频道无主体/令牌 → `AUTH_REQUIRED`；有主体但无权限 → `FORBIDDEN_CHANNEL`。 
- 公开频道仍须通过模式白名单（防任意字符串订阅耗资源）。

## 步骤规格（实现自写）

1. 解析 `subscribe.channel`；用命名表编译为模式（例 `order:{uuid}`）。 
2. **不匹配** → 响应 `error`/`SUBSCRIBE_REJECTED`；**不**加入 hub。 
3. 查 ACL（[templates/channel-acl.schema.json](./templates/channel-acl.schema.json)）：`public` / `private`。 
4. `private`：从会话取 `subject`（INPUTS §8）；无 → `AUTH_REQUIRED`。 
5. 调用授权谓词（例：`subject` 是否为 `order` 参与者）；否 → `FORBIDDEN_CHANNEL`。 
6. 通过 → 登记订阅（进入 `05` 步骤 3+）；回 `subscribed`（回显 `id`、`channel`）。 
7. **unsubscribe**：仅移除本连接上该频道；无需再次业务写授权（已是持有者操作）。 
8. 令牌过期（**默认**）：主动下发 `error`（码见 INPUTS §9，常用 `AUTH_REQUIRED`）并**断开连接**；**已投递事件不撤回**（客户端去重）。连接内续订 /「仅下次 subscribe 才拒」**仅**当 INPUTS §20 书面另路径（非默认；**禁**与默认并用开口）。

### 授权谓词（规格级）

```text
authorize_subscribe(subject, channel) -> allow | deny
 # 纯函数或端口；禁在 UI 层做最终裁决
```

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 模式外频道 | `SUBSCRIBE_REJECTED` |
| 未登录订私有 | `AUTH_REQUIRED` |
| 已登录无权限 | `FORBIDDEN_CHANNEL` |
| claim 列表模式（INPUTS 非默认） | 不在 claim 内 → `FORBIDDEN_CHANNEL`；扩权须重连 |
| 公开频道 | 仍校验白名单；通过则允许匿名（若产品允许） |
| 令牌过期（默认） | 主动 `error`（常用 `AUTH_REQUIRED`）+ 断开；另路径见 INPUTS §20 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 匿名订私有 | `AUTH_REQUIRED`；hub 无该订阅 |
| 他主体订私有 | `FORBIDDEN_CHANNEL` |
| 合法主体 | `subscribed`；可收 event |
| 非法频道串 | `SUBSCRIBE_REJECTED` |
| unsubscribe 后 | 不再投递该频道 |
