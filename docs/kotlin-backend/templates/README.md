# templates（非业务）

| 文件 | 用途 |
|------|------|
| `env.example` | 环境变量名 |
| `Makefile.snippet` | 目标名与命令字符串（与 `../commands.md` 同文） |
| `error-response.schema.json` | 错误 JSON shape |
| `docker-compose.test.yml.example` | 集成测 Postgres（复制为仓根 `docker-compose.test.yml`） |
| `gradle-libs.versions.toml.example` | version catalog 依赖键名骨架（非可运行业务） |
| `README.md` | 本说明 |

禁止可运行业务 route/用例源码。
