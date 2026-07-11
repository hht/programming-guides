# commands

| 脚本 | 动作 | 期望 |
|------|------|------|
| `check-inputs` | INPUTS §1–14 谓词（若适用含 §15–22） | exit 0 |
| `storage-up` | 本地 MinIO Compose up（健康检查就绪） | exit 0 |
| `test` | Lifecycle 探针：authorize、presign put、verify、私有 get、delete、无前端密钥 | exit 0 |
| `check-acceptance` | `11` A+B+D 可勾项 | exit 0 |
| `check` | check-inputs + storage-up + test + check-acceptance | exit 0 |
