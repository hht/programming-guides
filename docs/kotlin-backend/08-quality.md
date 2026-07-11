# 08 — 质量

## 必做

- `./gradlew detekt` 
- `./gradlew ktlintCheck`（或项目写明的 ktlint 任务名） 
- `./gradlew test`（排除 integration tag） 
- 生产：Logback JSON；`APP_ENV=prod` 时默认 info；禁把 secrets 打进日志 

## 宜做 / 参考

| 项 | 要求 |
|----|------|
| coverage | 宜做；裁则 11 写理由（本指南默认裁：发版以集成矩阵为准） |
| OTel/Sentry | **仅参考**，不进必勾 |
| JMH / 压测 | 仅参考 |

## 单测探针

| case | 期望 |
|------|------|
| detekt + ktlint | CI exit 0 |
