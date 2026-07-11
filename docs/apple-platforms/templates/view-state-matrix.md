# View-State 矩阵（实现仓填写）

> 每个主 Screen 一行。状态名可与产品一致，但须能映射到指南：`loading` / `empty` / `error` / `success|default` / `submitting` / `cancelled`。 
> **禁止**整表标 N/A。

| Screen | default/idle | loading | empty | error | submitting | cancelled | Retry / 主 CTA |
|--------|--------------|---------|-------|-------|------------|-----------|----------------|
| （例）Timeline | 有数据列表 | 首屏 Progress | 无帖文+发帖 CTA | inline+Retry | 发帖按钮 disabled | 离开不弹错 | Retry → load |
| | | | | | | | |
| | | | | | | | |
