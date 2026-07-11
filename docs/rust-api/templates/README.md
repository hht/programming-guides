# templates（非业务）

| 文件 | 用途 |
|------|------|
| `env.example` | 环境变量名 |
| `Makefile.snippet` | 目标名与命令字符串（与 `../commands.md` 同文） |
| `error-response.schema.json` | 错误 JSON shape |
| `docker-compose.test.yml.example` | 集成测 Postgres（复制为仓根 `docker-compose.test.yml`） |
| `Cargo.toml.features.snippet.toml` | 推荐 features 片段（非完整业务 crate） |
| `README.md` | 本说明 |

禁止可运行业务 service/handler 源码。
