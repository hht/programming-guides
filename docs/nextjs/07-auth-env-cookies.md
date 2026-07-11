# 07 — 鉴权、Cookie 与环境

## 不变量

- 默认会话：**HttpOnly Cookie**，名钉死 **`session`**  
- 属性：`HttpOnly`；`Secure`（生产）；`SameSite=Lax`；`Path=/`  
- 禁 localStorage 放 access token 当默认  
- `NEXT_PUBLIC_*` 仅非秘密  

## Cookie 会话步骤（INPUTS §5=Cookie 时钉死）

1. **签发**：登录成功后 `cookies().set("session", token, { httpOnly:true, secure:prod, sameSite:"lax", path:"/", maxAge })`。  
2. **读取**：Server Component / Action / middleware 用 `cookies().get("session")`；校验签名/解密；失败视未登录。  
3. **清除**：登出 `cookies().delete("session")` 或 `set` 空+maxAge=0。  
4. **保护**：`middleware` `matcher` = INPUTS **§5c** 私有前缀（或「除公开 path 外」规则）；未登录 `redirect` 到 §9 登录 path（默认 `/login`）。公开 path（§2 勾「公开?=是」）不得进私有 matcher。  
5. **授权**：§5b=仅会话全权 → Action 只验登录。§5b=有角色表 → 按表拒绝时返回 `forbidden`（见 `05`）。  
6. token：按 INPUTS **§5d**（默认 HMAC-SHA256；claims 仅 `sub`+`exp`；`maxAge` 默认 7d）。opaque+DB 不在本册。  
7. 登录 Action：字段按 **§5e**；身份校验按 **§5f**（得 `sub`）；成功后 `cookies().set` 步骤 1。  

## 无鉴权

INPUTS §5=无 → 跳过本文件步骤；`05` 跳过授权。

## 环境

`.env.example` 列名；staging/prod 成对。

## 探针

| case | 期望 |
|------|------|
| 无 `session` 访私有 | redirect `/login` |
| 登出后 | Cookie 清除 |
| PUBLIC 含密钥 | check 失败 |
