# 00 — 原则与框架 MUST

> Normative: MUST / MUST NOT（RFC 2119）  
> 语言层：随宿主应用册 Language Gate（本册不另开语言百科；实现语言的 fmt/lint 跟宿主 `commands`）。

## 品类

部署·密钥·回滚·健康门闸：发布可重复、可回滚、密钥不入库。

## 核心正确性路径（全文唯一）

部署/回滚/健康见对应章；本册不发明第二套发布语义。

## 框架 MUST

| ID | 关键词 | 规约 | 探针 |
|----|--------|------|------|
| F01 | MUST NOT | 密钥入库 | 扫描/抽检 |
| F02 | MUST | 不可变镜像（或等价不可变产物） | `03` |
| F03 | MUST NOT | git pull 当生产发布 | 同上 |
| F04 | MUST | 健康门闸未过不得标成功 | `05` |
| F05 | MUST | 可回滚上一成功版本 | `04` |
| F06 | MUST | staging/prod 结构同构 | INPUTS |
| F07 | MUST | deletion-first | 目录 |

## SSOT

| 真相 | Owner |
|------|--------|
| 环境成对 / 镜像 / 健康谓词 | `INPUTS.md` |
| 发布与回滚 | `03`/`04` |
| 健康 | `05` |
| CI 接线 | `09`/`commands` |
| 业务词表 | 目标仓 `UBIQUITOUS_LANGUAGE.md` |
