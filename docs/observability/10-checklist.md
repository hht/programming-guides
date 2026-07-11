# 10 — 清单

- [ ] `INPUTS OK`；信号裁剪已遵守（默认 logs+traces；**未**勾「仅 metrics」）；**未**把商业 APM 当必装替代规格 
- [ ] `01` 栈：OTel + JSON 日志 + OTLP；后端可换 
- [ ] `02` Pass1 词表（correlation / span / metric / event） 
- [ ] `03` Resource + 语义约定 
- [ ] `04` extract / inject / 回显 
- [ ] `05` **Telemetry Correlate Lifecycle** 八步（id→日志可关联 ≡ sources / `11`§B） 
- [ ] `06` 结构化日志字段（logs；本册默认必勾） 
- [ ] `07` metrics 登记 + 基数（若勾 metrics；否则 INPUTS §6 N/A） 
- [ ] `08` Span + OTLP（traces；本册默认必勾） 
- [ ] `commands` `check` 绿 
- [ ] `11` **A+B+D**（B 为用户可感知关联，非「装了 Sentry」） 
