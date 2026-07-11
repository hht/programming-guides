# 03 — 模板 SSOT 与 compose

## 不变量

- **生产事务信**正文与主题来自 **版本化模板** + **变量契约**；compose 输出绑定 `template_id` + `template_version`。  
- 变量校验失败 → **不得** enqueue/submit（`EMAIL_TEMPLATE_INVALID`）。  
- 已发送（或已 `submitted`）消息 **冻结**当时版本；改模板 = 新版本，不改写历史行。

## 步骤规格（实现自写）

### 1. 登记模板

1. 每个事务场景一个 `template_id`（Pass1 词根）。  
2. 目录或 DB 行包含：`subject` 模板、`body_html`、`body_text`、`variables.schema`（必填/类型）。  
3. 发布时递增 `template_version`（整数或 semver 主.次，INPUTS 钉一种；**默认整数自增**）。

### 2. Compose

1. 输入：`template_id` + `locale?` + `variables`（业务对象投影，禁把整个 ORM 实体塞进模板）。  
2. 按 schema **校验** variables；缺字段/类型错 → `EMAIL_TEMPLATE_INVALID`。  
3. 渲染 subject / html / text（引擎任选：mustache / MJML 构建产物 / Go text/template 等；**须** HTML escape 默认开启，禁三元拼接用户输入进裸 HTML）。  
4. 输出：`ComposedEmail { template_id, template_version, subject, html, text, to, from, headers? }`。  
5. **不**在本步调用供应商。

### 3. 与 Lifecycle 衔接

- Lifecycle 步骤 1 = 本 compose；成功后才进入 enqueue/send（`04`/`05`）。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 未知 template_id | `EMAIL_TEMPLATE_INVALID` |
| 变量校验失败 | 同上；不出站 |
| 模板缺 text 部分 | 默认拒绝（可访问性/多客户端）；INPUTS 可书面允许仅 HTML |
| locale 缺失且模板要求 | 回退默认 locale（INPUTS 钉名）或拒绝 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 合法变量 | 得到稳定 subject/html/text；含 version |
| 缺必填变量 | `EMAIL_TEMPLATE_INVALID`；无出站调用 |
| 用户输入含 HTML | 默认被 escape，不出现裸脚本标签 |
| 升版后旧消息 | 历史行 version 不变 |
