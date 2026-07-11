# Delivery state matrix

> SSOT for legal transitions — see [06](../06-provider-ack-and-delivery-state.md).  
> `✓` = allowed；空白 = reject（状态不变 + 度量）。

| from \ to | queued | submitted | delivered | bounced | complained | failed | suppressed |
|-----------|--------|-----------|-----------|---------|------------|--------|------------|
| composed | ✓ | | | | | ✓ | ✓ |
| queued | | ✓ | | | | ✓ | ✓ |
| submitted | | | ✓ | ✓ | ✓ | ✓ | |
| delivered | | | | | | | |
| bounced | | | | | | | |
| complained | | | | | | | |
| failed | | | | | | | |
| suppressed | | | | | | | |

## 事件 → 目标状态（适配器映射后）

| 归一事件 | 典型目标 |
|----------|----------|
| `provider.accepted` | `submitted` |
| `provider.delivered` | `delivered` |
| `provider.hard_bounce` | `bounced` |
| `provider.complaint` | `complained` |
| `provider.rejected` / permanent | `failed` |
| `app.suppressed` | `suppressed`（未出站） |

## 备注

- 终态：`delivered` / `bounced` / `complained` / `failed` / `suppressed` — 默认不再转移。  
- `composed` 可不落库；若落库，仅允许到 `queued`/`failed`/`suppressed`。  
- soft bounce：**不**单独占一列状态；记 `last_error` + 计数，超限再进 `bounced` 或 `failed`（INPUTS）。
