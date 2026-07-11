# 08 — Mac 桌面专章

> INPUTS §1 **含 Mac** 时本章必读必做；否则实现报告写 `N/A — Mac not targeted`（维护者验收时本节条件勾选）。

## 不变量

- Mac = **原生** macOS target（SwiftUI + 必要 AppKit 桥接），**不是** iOS Catalyst 默认。 
- 与 iOS **同一** Features / Store / Route；差异限窗口、菜单、键盘、指针。 
- 遵守 [HIG](https://developer.apple.com/design/human-interface-guidelines/) macOS 导航与窗口约定。

## 步骤规格（实现自写）

### A. 窗口

1. `WindowGroup` 定义主窗口；多窗（若 INPUTS §11）用独立 `WindowGroup(id:)` 或 `openWindow`。 
2. 默认尺寸 / 最小尺寸在场景修饰符中写明；状态恢复用系统 `Scene` 存储或写明关闭。 
3. 设置用 `Settings` scene（SwiftUI）或等价偏好窗口；禁把偏好埋进无可发现入口。

### B. 菜单栏

1. 用 `Commands` / `CommandGroup` 声明：**Quit**（系统）、**Preferences/Settings**、主业务命令（与 INPUTS §11 表一一对应）。 
2. 菜单 action → **同一 Intent** 进 Store（不平行一套 Mac 专用业务逻辑）。 
3. 禁用态绑定 Store 派生态（例：无选中时 Disable「删除」）。

### C. 键盘

1. `.keyboardShortcut` 与菜单命令一致；冲突表写入 INPUTS。 
2. 文本字段内快捷键不劫持系统拷贝粘贴。 
3. 可访问性：快捷键不成为唯一操作路径（菜单/按钮须可达）。

### D. 指针与窗体控件

1. Hover / context menu 增强；主流程仍可用触控等价（若 iPad 共享）。 
2. 工具栏用 `ToolbarItem`；Mac 上优先跟随 HIG 工具栏密度。

## 失败分类 / 默认值

| 情况 | 行为 |
|------|------|
| 菜单触发时 Store 忙 | 同 `05` 门闸；菜单 disabled |
| 多窗同一实体 | 约定：共享 Store vs 每窗实例——默认**共享 App 级会话 + 窗级 UI**；INPUTS 可改 |

## 单测探针（case → 期望）

| case | 期望 |
|------|------|
| 主命令 Intent | 与按钮同一 `send` 路径（单测 Store） |
| Settings 打开 | Settings scene 可编译进 macOS target |
| 快捷键声明 | 与 INPUTS 表键位一致（清单审查可接受） |

## 标杆对照（Mac 面）

| 标杆 | 学什么 |
|------|--------|
| [UTM](https://github.com/utmapp/UTM) | 多平台工程、Mac 设置与窗口级操作 |
| （可选参考）[Whisky](https://github.com/Whisky-App/Whisky) | SwiftUI Mac 桌面交互密度 |

不学：虚拟化/Wine 业务实现进本指南。
