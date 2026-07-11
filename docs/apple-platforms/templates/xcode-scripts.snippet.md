# Xcode / Make script names（仅键名与命令字符串；非可运行业务）

```make
check-inputs:
	@test -f INPUTS.md || (echo "missing INPUTS"; exit 1)
	# 实现仓可加：校验矩阵文件非空、平台勾选

test:
	xcodebuild test -scheme App -destination 'platform=iOS Simulator,name=iPhone 16'

test-e2e-apple:
	xcodebuild test -scheme App -destination 'platform=iOS Simulator,name=iPhone 16'
	# 若 INPUTS 含 Mac：再加 macOS destination

check-acceptance:
	@echo "Verify docs/apple-platforms/11 A+B+D manually or with checklist script"

check: check-inputs test check-acceptance
```

实现仓按本仓库 `commands.md` 对齐脚本名：`check-inputs` / `test` / `test:e2e-apple` / `check-acceptance` / `check`。
