# 07 — 配置、鉴权与密钥

## 不变量

- 唯一读点：`source/config/`  
- 密钥永不 log 到 stdout；debug 日志须 redact  
- 策略以 INPUTS **§8** 勾选为准（A/B/C）

## 步骤规格

1. **A 仅 env**：`config/env.ts` 用 Zod 解析 `process.env`；缺必填 → USAGE/ERROR + 列出变量名。  
2. **B 文件+env**：默认路径钉死（例：`~/.config/<cli-name>/config.json`）；env 覆盖同名键；文件权限建议 `0600`（能设则设）。  
3. **C token 文件**：路径 + 权限；登录子命令写入；logout 删除；gitignore 本地副本。  
4. staging/prod：按 INPUTS 勾选的区分方式实现（`MYCLI_ENV` **或** 仅 `MYCLI_API_URL`）；禁止硬编码生产 URL。  
5. 鉴权失败：稳定错误码字符串 + 引导 `auth login`（或等价命令）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 缺必填 env | exit 2；stderr 列缺失键 |
| 配置 JSON 损坏 | exit 1；stderr 含路径 |
| token 过期 | exit 1；提示重新登录 |

## 单测探针

| case | 期望 |
|------|------|
| 最小合法 env | config 对象字段齐全 |
| 缺键 | 抛/返回 Result err，命令侧映射 exit 2 |
| redact | 日志字符串不含 raw token |
