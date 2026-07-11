# 03 — 信号与语义约定

## 不变量

- 遥测 = 三类信号：**logs**、**metrics**、**traces**（按 INPUTS 裁剪）。**默认必做 = logs + traces**；**metrics 可选**；**禁止**「仅 metrics」。 

- 命名与属性优先对齐 **OpenTelemetry Semantic Conventions**；自定义属性不得与约定键冲突。 
- Resource 至少含 **`service.name`**；环境维按 INPUTS（默认 `deployment.environment` ← `APP_ENV`）。

## 步骤规格（实现自写）

1. **登记信号** 
 - 对照 INPUTS §1 勾选（须含 logs + traces）；未勾信号（通常仅 metrics）在实现仓 `ops/telemetry.md`（或等价）标 `N/A`；INPUTS §4/§5/§6 随信号条件化。 
2. **装配 Resource** 
 - 进程启动时创建唯一 Resource；`service.name` 不可空；禁每请求新建 Resource。 
3. **选语义约定** 
 - HTTP/DB/RPC 等用 OTel 约定属性（如 `http.request.method`、`http.route`）；**路由用模板**（`/orders/{id}`），禁原始高基数 URL 当默认维度。 
4. **自定义属性闸门** 
 - 仅词表已收录键；PII 红线见 INPUTS §8。 
5. **与生命周期衔接** 
 - 任何 emit 必须能进入 [05](./05-telemetry-correlate-lifecycle.md) 的关联链（有 context 或显式注入 id）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| `service.name` 缺失 | 启动非 0（或 fail-closed 拒绝导出） |
| 属性键冲突约定 | 构建/探针失败；改名 |
| 未勾信号被调用 | 空操作或测试红（择一；默认**测试红**防静默吞） |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| Resource 含 service.name | 等于 INPUTS |
| HTTP span/metric 用 route 模板 | 不含无界 id 段当 label 默认 |
| 禁用属性（密码） | 被剥离或不存在 |
