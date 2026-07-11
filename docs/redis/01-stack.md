# 01 — 栈

> 框架 MUST 见 [`00`](./00-principles.md)。本册无独立 Language Gate；实现语言的 fmt/lint 跟宿主应用册。

| 层 | 选择 |
|----|------|
| 引擎 | **Redis ≥7**（本地镜像建议 `redis:7`） |
| 协议 | RESP；应用经官方客户端，禁手写裸 TCP 当默认 |
| Go 客户端 | **[redis/go-redis](https://github.com/redis/go-redis)**（`github.com/redis/go-redis/v9`） |
| TS/Node 客户端 | **[redis/ioredis](https://github.com/redis/ioredis)** |
| Python 客户端 | **redis-py**（`redis` PyPI；asyncio 用同库 async） |
| 键 / TTL | 本册 `03`；前缀与 TTL 表在 INPUTS |
| 本地 | Compose 见 [templates/compose.redis.yaml.example](./templates/compose.redis.yaml.example) |
| 会话（可选） | Redis 路径见 `08`；**默认会话存储仍为 Postgres**（[auth](../auth/README.md)） |

禁止：生产用「内存 Map 冒充 Redis」无声明；「ioredis 或 node-redis 任选」开口；同语言第二默认客户端。

## 脚手架

```bash
# 1) 复制 templates/compose.redis.yaml.example → 本地起 Redis 7
# 2) 按应用册安装客户端（三选一，勿并行采用两套）：
# Go: go get github.com/redis/go-redis/v9
# TS: pnpm add ioredis
# Python: pip/uv add redis
# 3) 配置 REDIS_URL（staging/prod 成对；值不入库）
# 4) 健康：PING → PONG（实现仓 check 探针）
```

## 版本

| 项 | 策略 |
|----|------|
| Redis | 大版本 **7+**；补丁跟镜像稳定标签 |
| 客户端 | lockfile 约定次版本；大版本跟随上游维护线 |
| 应用册 | go / fastapi / nextjs 等册引用本册，不另发明键约定 |

## 冲突裁决（写入 sources）

流行度（如某语言多客户端）**不**单独定胜负；本册按 P0/官方仓 + 类型与连接模型清晰度定为上表三客户端。
