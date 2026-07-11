# Gradle / script task names (snippet only — not a runnable project)

Map `docs/android-compose/commands.md` to tasks, for example:

| commands.md | 例 |
|-------------|-----|
| `check-inputs` | `./scripts/check-inputs.sh` 或自定义 task |
| `test` | `./gradlew test` |
| `test:ui` | `./gradlew connectedDebugAndroidTest`（或 INPUTS 写死的托管设备任务） |
| `test:e2e-android` | 封装矩阵的 Gradle/脚本入口 |
| `check-acceptance` | 清单自检脚本 |
| `check` | 聚合：inputs + test + acceptance；（发版）+ ui + e2e |

锁版本用 Version Catalog；本文件不含依赖坐标数字。
