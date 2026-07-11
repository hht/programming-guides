# 01 — 栈

> 框架 MUST 见 [`00`](./00-principles.md)。本册无独立 Language Gate；实现语言的 fmt/lint 跟宿主应用册。

| 层 | 选择 |
|----|------|
| 传输（默认） | **WebSocket**（RFC 6455） |
| 传输（可选） | **SSE**（WHATWG EventSource）— 仅当 INPUTS 写明；只读 |
| 应用协议 | **JSON envelope**（schema 见 templates）；UTF-8 text frame 默认 |
| 服务端默认册 | **Go** + **[`github.com/coder/websocket`](https://github.com/coder/websocket)**（原 nhooyr 线） |
| 服务端可映射 | FastAPI（`websockets` / Starlette）· Node（`ws`）— **步骤同 `05`**；库随应用册内约定，**禁止**同册双默认 |
| 客户端浏览器 | 原生 `WebSocket`；SSE 用 `EventSource` |
| 客户端 React/TS | 薄订阅 hook/模块落在 `features/<capability>/`；**禁**默认 Socket.IO client |
| 多实例扇出（可选） | Redis pub/sub — 对齐 [redis](../redis/README.md)（ioredis / go-redis / redis-py） |
| 本地 | 应用进程自起 WS；可选 Compose Redis（见 redis templates） |

禁止：生产以 Socket.IO 为默认；「gorilla 或 coder 任选」开口；SSE 与 WS 双默认；无 schema 的自由 JSON 当契约。

## 脚手架

```bash
# 1) 按应用册初始化服务（例 Go）：
# go get github.com/coder/websocket
# 2) 复制 templates/env.example → 配置 REALTIME_WS_URL（staging/prod 成对；值不入库）
# 3) 复制 message-envelope.schema.json / channel-acl.schema.json 为契约登记
# 4) 健康：WS upgrade 成功 + 应用级 ping/pong 一轮（实现仓 check 探针）
# 5) 若多实例：按 redis 册起 Redis 7 + REDIS_URL
```

## 版本

| 项 | 策略 |
|----|------|
| coder/websocket | lockfile 约定次版本；跟随维护线大版本 |
| 应用 Go | 跟应用册（建议 ≥1.22） |
| envelope `v` | 破坏性变更升主版本；并存须在 INPUTS 写明 |

## 冲突裁决（写入 sources）

| 候选 | 为何不默认 |
|------|------------|
| Socket.IO | 流行；协议绑定强 → **学映射不指定** |
| gorilla/websocket | 星数高；context 模型弱于 coder 线 → **冲突表败** |
| 仅 SSE | 无标准双向 → **可选只读** |
| Centrifugo 二进制 | 优秀标杆；本册约定**可自写步骤**而非强制托管运行时 |
