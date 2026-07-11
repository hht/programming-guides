# 06 — 冷/热与预算

## 不变量

- **Cold** 与 **Warm** 都必须能走完 Lifecycle；业务结果一致。 
- **墙钟超时**与 **CPU 预算**写明或 INPUTS 必填；墙钟 ≥ 可感知 CPU 消耗。 
- 禁止用「多试几次就 hot 了」掩盖冷启动正确性 bug。

## 步骤规格（实现自写）

### 1. 定义

| 状态 | 含义（规格） |
|------|----------------|
| cold | 新 isolate / 新执行环境；模块首次求值、绑定句柄建立 |
| warm | 复用已初始化环境；跳过一次性 init，直接进 handler |

### 2. 初始化门闸

1. **一次性 init**（cold 路径）：校验必填 env、绑定存在、只读配置缓存。 
2. Init 失败 → 启动或首请求非 0 / `INTERNAL`；禁半初始化对外 200。 
3. Warm 路径**禁止**依赖「上次请求留下的未文档化可变全局」作为正确性条件（请求级状态进 ctx）。

### 3. 预算数字（默认）

| 平台 | 墙钟默认（INPUTS 可改） | CPU / 备注 |
|------|------------------------|------------|
| Workers | **30s** 请求预算（仍受计划 hard limit） | CPU time 跟计划；超限 → TIMEOUT |
| OpenNext/Vercel | **10s** | 跟托管套餐；改则写明 |
| Lambda | **30s**（上限 900） | `context.getRemainingTimeInMillis` 可作探针 |

### 4. 临近超时

1. 下游调用传 **剩余预算**（或硬 deadline）。 
2. 剩余不足完成写 → **不**开始写；返回 TIMEOUT 或 transient 供异步 retry。 
3. 日志可含 `invocation_state=cold|warm`（结构化字段名写入词表）；第三方 APM 非必勾。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| cold init 缺密钥 | fail-closed |
| 超 CPU/墙钟 | TIMEOUT |
| warm 脏全局导致结果漂移 | 测试红灯；重构为请求级状态 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 两次连续 invoke | 第二次可 warm；结果与首次业务字段一致 |
| 强制超时 | TIMEOUT |
| 缺 env 冷启动 | 非成功响应 |
