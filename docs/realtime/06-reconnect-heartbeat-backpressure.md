# 06 — 重连 / 心跳 / 背压

## 不变量

- 心跳间隔 **25s**；超时 **60s** → 断开（`HEARTBEAT_TIMEOUT`）。 
- 重连退避：**1s** 起，乘数 **2**，上限 **30s**，**±20% jitter**。 
- 出站队列：**256 条** 或 **1 MiB**（先触达）；默认行为 **断开 + `BACKPRESSURE`**。 
- 改数字必须写 INPUTS；禁止代码内魔法数分叉。

## 步骤规格（实现自写）

### 心跳

1. 连接建立后启动定时器：每 **25s** 发送 `{ type:"ping" }`（或 RFC6455 ping；应用级与协议级**二选一写明**，默认**应用级 ping/pong** 便于测试）。 
2. 收到 `ping` 必须在处理循环内回 `pong`。 
3. 若距上次成功收包（含 pong/任意合法帧）≥ **60s** → 关闭连接；客户端走重连。 
4. 半开连接不得继续 enqueue。

### 重连（客户端）

1. `onclose` / 心跳失败 → 状态 `disconnected`。 
2. `delay = min(30s, 1s * 2^attempt)`；再乘 `U(0.8, 1.2)` jitter。 
3. 重连成功 → `connecting`→`connected` → 对订阅集逐个 `subscribe`（`05`）。 
4. `attempt` 在成功 `connected` 后归零。 
5. **禁止**无抖动的雷群（多 tab 同秒重连）；jitter 必做。

### 背压（服务端）

1. 每连接维护出站队列；计量 **条数** 与 **字节**。 
2. `enqueue` 前：若 `len>=256` 或 `bytes>=1MiB` → 按 INPUTS：默认 `close(BACKPRESSURE)`。 
3. 慢客户端不得拖垮 hub 广播循环：广播时对失败连接异步关闭，不阻塞其他连接。 
4. 可选「丢最旧」仅当 INPUTS 写明；须有指标名（非第三方 APM 必勾）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 60s 无收包 | 断开 `HEARTBEAT_TIMEOUT` |
| 背压触顶 | 默认断开 `BACKPRESSURE` |
| 重连中 | UI `connecting`；不伪造成功订阅 |
| 服务端重启 | 全体断开；客户端退避重连 + resubscribe |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 正常 ping/pong | 连接保持 > 60s |
| 抑制 pong | ≤60s+ε 断开 |
| 退避序列 | 延迟落入 jitter 窗 |
| 灌满 256 事件 | `BACKPRESSURE` 断开 |
| 广播时单连接堵塞 | 其他连接仍收齐 |
