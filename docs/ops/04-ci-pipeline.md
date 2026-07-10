# 04 — CI 流水线

## 不变量

- PR：`check`（lint/test/build 镜像或至少 `docker build`）须绿才可合并  
- 默认分支/tag：`release` 可构建并推送镜像；部署须显式 environment 审批或 INPUTS 允许自动  
- Action 引用钉 **commit SHA**  

## 步骤规格

1. `ci.yml`：checkout → 语言 check（调用应用指南 commands）→ `docker build`。  
2. `release.yml`：build → tag(`sha`) → push →（可选）`kamal deploy` 或 `compose` 远程。  
3. 密钥仅 `secrets.*`；禁止 echo 密钥。  
4. 产物：镜像 digest 写入 job summary。  

## 失败分类

| 情况 | 行为 |
|------|------|
| check 红 | 禁合并 |
| push 失败 | release 失败；不标成功 |
| 缺 SHA 钉死的 action | 评审不通过 |

## 探针

| case | 期望 |
|------|------|
| PR 无 test | ci 红或不完整=FAIL 门禁 |
| workflow 用 `@v4` 浮动 | 改为 SHA |
