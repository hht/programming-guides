# healthcheck 步骤形（实现自写；本文件非可执行业务）

1. 读 INPUTS §1 + §1b，拼出完整 URL 列表（本地：`http://127.0.0.1:<port><health_path>`）。 
2. `TIMEOUT=60` `INTERVAL=5`。 
3. 循环至超时：每个 URL `GET`，期望 HTTP 200（或 INPUTS 约定码）。 
4. 全过 → exit 0；否则 exit 1。
