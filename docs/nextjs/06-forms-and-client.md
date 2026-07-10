# 06 — 表单与 Client 边界

## 不变量

- 表单默认可无 JS 提交到 Action（progressive enhancement 优先）  
- `"use client"` 只包输入控件/弹层；数据获取仍在服务端  

## 步骤

1. 简单表单：`<form action={action}>`。  
2. 复杂校验 UX：RHF + zod；submit 调 Action 或 `formAction`。  
3. 四态：idle/loading/error/success 在 Client 叶或 `useActionState`。  
4. Toast：sonner 可选；错误须可读文本。  

## 探针

| case | 期望 |
|------|------|
| 禁用 JS | 仍能提交并看到错误/成功（重载后） |
