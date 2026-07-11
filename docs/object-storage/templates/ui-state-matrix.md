# Upload UI state matrix（规格）

| 状态 | 用户可见 | 允许动作 | 退出 |
|------|----------|----------|------|
| `idle` | 选择文件 | 选文件 → authorizing | — |
| `authorizing` | 校验权限中 | 无 | 成功 → uploading；失败 → error |
| `uploading` | 进度 | 取消（可选） | 2xx → verifying；失败 → error |
| `verifying` | 确认中 | 无 | ok → ready；失败 → error |
| `ready` | 可预览/提交业务 | 替换（回 idle）、删除 | — |
| `error` | 错误码文案 | 重试 → idle/authorizing | — |

禁止：`uploading` 成功后直接当 `ready` 而跳过 `verifying`。
