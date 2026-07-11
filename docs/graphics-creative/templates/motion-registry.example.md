# Motion Registry（示例）

> 复制到实现仓 `motion/registry.md`（或等价路径）后填写。  
> 每条关键动效必须有预算数字；`status=pass|degraded` 才可发版。

| id | surface | trigger | properties | duration_ms | target_fps | frame_budget_ms | main_thread_budget_ms | measure_tool | status | notes |
|----|---------|---------|------------|-------------|------------|-----------------|----------------------|--------------|--------|-------|
| hero-enter | home-hero | enter | transform, opacity | 400 | 60 | 16.67 | 8 | chrome-performance | unmeasured | |
| cta-hover | home-cta | hover | transform, opacity | 160 | 60 | 16.67 | 8 | chrome-performance | unmeasured | |
| panel-reveal | settings | enter | transform, opacity | 280 | 60 | 16.67 | 8 | chrome-performance | unmeasured | 禁用 width 动画 |

## 校验

- 属性 ⊆ [03](../03-property-whitelist.md)  
- 数字对齐 [04](../04-frame-budget-numbers.md)  
- JSON 导出时对齐 [frame-budget.schema.json](./frame-budget.schema.json)  
