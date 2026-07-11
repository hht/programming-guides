# Design Tokens — Token 工程指南

> **这是工程指南，不是半成品项目。**  
> 在 [INPUTS.md](./INPUTS.md) 齐备时，agent 按本文在**新仓库**落地世界级 **source → transform → consume** Token 流水线。  
> **默认栈**：**W3C Design Tokens（DTCG）** 作源格式 + **Style Dictionary**（当前主线，DTCG）作唯一变换工具链。**禁止**平行第二套色名 / 第二套 token 源 / 第二套 transform。  
> **对位**：[ui-ux](../ui-ux/README.md) 管设计决策与 Figma；本册管工程 Apply。设计侧 `design/tokens.md` / Figma Variables 与本册 **语义 token 路径同名**。  
> **来源**：[sources.md](./sources.md)

## 品类一句话

把设计决策中的颜色 / 字阶 / 间距 / 圆角 / 阴影钉成**单一源 token**，经可重复变换进入 UI 运行时，组件只消费语义名，禁止散落第二套色名或裸 hex。

## 核心正确性路径

**Token Apply Lifecycle**（[05](./05-token-apply-lifecycle.md)）：

`source tokens → transform → consume in UI`（编号步骤）

## Agent 执行协议

1. [INPUTS.md](./INPUTS.md) → `INPUTS OK` 或停；与 [ui-ux INPUTS](../ui-ux/INPUTS.md) 品牌/深色项对齐或书面裁剪  
2. [01](./01-stack.md) + [02](./02-directory-and-naming.md)（建 `UBIQUITOUS_LANGUAGE.md` token 词表节）  
3. [03](./03-token-model-and-color-ssot.md) / [04](./04-source-tokens.md) / [05](./05-token-apply-lifecycle.md)  
4. [06](./06-transform.md) / [07](./07-consume-in-ui.md) / [08](./08-ui-ux-and-platforms.md)  
5. [commands.md](./commands.md) `check` 绿  
6. [10](./10-checklist.md) + [11](./11-world-class-acceptance.md) **A+B+D**（C 节仅指南维护者）  

## 索引

| 文档 | 用途 |
|------|------|
| [INPUTS](./INPUTS.md) | 缺则停；源格式 / 平台输出 / 色名词表 |
| [00](./00-principles.md) | 不变量 / SSOT |
| [01](./01-stack.md) | 默认栈与脚手架 |
| [02](./02-directory-and-naming.md) | 目录 + Pass1/Pass2 |
| [03](./03-token-model-and-color-ssot.md) | 分层模型 + **禁第二套色名** |
| [04](./04-source-tokens.md) | DTCG 源文件与 Figma 边界 |
| [05](./05-token-apply-lifecycle.md) | **Token Apply Lifecycle（核心）** |
| [06](./06-transform.md) | Style Dictionary 变换与产物 |
| [07](./07-consume-in-ui.md) | UI 消费契约 |
| [08](./08-ui-ux-and-platforms.md) | 对位 ui-ux / 多平台 / 漂移门闸 |
| [09](./09-testing-ci.md) | 单测与发版矩阵 |
| [10](./10-checklist.md) | 开工勾选 |
| [11](./11-world-class-acceptance.md) | 世界级验收 |
| [commands](./commands.md) | 命令门禁 |
| [sources](./sources.md) | P0/P1/差距表 |
| [templates](./templates/README.md) | schema / 配置例 / 色名词表 |
