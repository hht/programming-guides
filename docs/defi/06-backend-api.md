# 06 — 后端 API（规格）

## 边界

submit 门闸以 **链上二次读取** 为准；后端数字可展示。

## 会话请求

统一包装：带 Bearer；401 → 清会话。与 [04](./04-wallet-and-siwe.md) 一致。

## 最小契约

[openapi-auth-claim.stub.yaml](./templates/openapi-auth-claim.stub.yaml)：

- `GET /auth/nonce` · `POST /auth/verify` 
- `POST /claim/signature` · `POST /claim/confirm`（幂等：`success` | `confirm_failed` | `already_confirmed`） 

业务 API 以用户提供的完整 OpenAPI 为准；本 stub 只约定登录/领取语义。

## 环境成对

`VITE_APP_ENV` 必须等于地址表 `env` 字段，且与 API Base 成对（见 INPUTS 文件约定 `addresses/<env>/<chainId>.ts`）。
