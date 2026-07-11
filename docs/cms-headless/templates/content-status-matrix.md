# ContentDocument 状态矩阵（例）

> 实现仓可扩展中间态（如 `validated`），但**非法边必须拒绝**；与 `05` / `07` 一致。 
> 供应商原始状态只经 `04` 映射进入下表，不直接写业务表绕过。

## 状态

| 状态 | 含义 | 用户可见建议 |
|------|------|--------------|
| `draft` | 可编辑；公开 Delivery 不可见 | 编辑中 / 仅预览 |
| `validated` | 可选：已通过校验、待发布 | 可发布 |
| `published` | 已发布；Delivery 可读 | 公开可见 |
| `archived` | 可选终态：下线且不回到编辑队列 | 已归档 |

## 合法转移

| from → to | 触发（例） |
|-----------|------------|
| → `draft` | saveDraft（新建） |
| `draft` → `draft` | saveDraft（更新） |
| `draft` → `validated` | validate ok（可选中间态） |
| `draft` → `published` | validate ok 后 publish（跳过 validated 允许） |
| `validated` → `published` | publish |
| `validated` → `draft` | 再编辑 / validate 过期 |
| `published` → `draft` | unpublish（默认） |
| `published` → `archived` | archive（若 INPUTS 启用） |
| `published` → `published` | 重复 publish（幂等）或发布新版本字段更新（仍须 validate） |
| `archived` → `draft` | 恢复编辑（若允许；INPUTS 约定） |

## 非法边（必须拒）

| from → to | 原因 |
|-----------|------|
| `draft` → `published`（跳过 validate） | 无校验不得发布 |
| `archived` → `published`（无校验） | 须经 draft+validate 或写明例外 |
| 任意 → `published` 当 validate 失败 | 硬门闸 |
| 公开 Delivery 返回 `draft` 正文 | 消费契约禁止 |

## 与公开消费

- 公开 `fetchPublished` **不是**状态转移触发源。 
- 唯一默认上线触发：`05` 步骤 3 `publish`（经 validate）。 
- 预览 `fetchPreview` 可读 `draft`，**不得**写入 `published`。
