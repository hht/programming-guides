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
4. **保护**：默认 **middleware** `matcher` 私有前缀；未登录 `redirect` 到登录 path（INPUTS 写登录 path，默认 `/login`）。  
5. token 格式/密钥：`SESSION_SECRET` env；具体算法可自研 HMAC 或接 `docs/auth/`（若已有）。  

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
