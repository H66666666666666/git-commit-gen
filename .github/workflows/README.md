# GitHub Actions

本项目使用 GitHub Actions 实现自动化工作流。

## 工作流列表

### 1. CI (持续集成)

**文件**：`.github/workflows/ci.yml`

**触发条件**：
- 推送到 `main` 分支
- 创建 Pull Request 到 `main` 分支

**功能**：
- ✅ 自动测试（Node.js 18.x 和 20.x）
- ✅ 自动构建
- ✅ 上传构建产物

### 2. Publish to npm (自动发布)

**文件**：`.github/workflows/publish.yml`

**触发条件**：
- 创建 GitHub Release

**功能**：
- ✅ 自动测试
- ✅ 自动构建
- ✅ 自动发布到 npm

## 设置说明

### 1. 设置 npm Token

1. 登录 npm：https://www.npmjs.com
2. 点击头像 → Access Tokens
3. 创建一个新的 Token（选择 Automation 类型）
4. 复制 Token

### 2. 设置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 Settings → Secrets and variables → Actions
3. 点击 New repository secret
4. 名称：`NPM_TOKEN`
5. 值：你的 npm Token

### 3. 创建 Release

1. 进入你的 GitHub 仓库
2. 点击 Releases → Create a new release
3. 填写版本号和说明
4. 点击 Publish release

**效果**：GitHub Action 会自动发布到 npm！

## 示例

### 推送代码

```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

**效果**：GitHub Action 会自动运行测试和构建。

### 创建 Release

1. 进入 GitHub 仓库
2. 点击 Releases → Create a new release
3. 版本号：`v1.1.0`
4. 说明：添加了新功能
5. 点击 Publish release

**效果**：GitHub Action 会自动发布到 npm！

## 查看状态

1. 进入你的 GitHub 仓库
2. 点击 Actions 标签
3. 查看工作流运行状态

## 常见问题

### Q: 测试失败怎么办？

A: 查看 Actions 日志，找到失败的原因，修复后重新推送。

### Q: 发布失败怎么办？

A: 检查 NPM_TOKEN 是否正确设置，确保有发布权限。

### Q: 如何跳过 CI？

A: 在 commit 信息中添加 `[skip ci]`：

```bash
git commit -m "docs: update README [skip ci]"
```
