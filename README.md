# git-commit-gen

> 🤖 AI 驱动的 Git Commit 信息生成器 —— 让你的 commit 信息更专业、更规范

## 🎯 这个项目有什么用？

### 解决的问题

你是否遇到过这些情况？

- ❌ `git commit -m "fix bug"` - 信息太模糊，不知道修了什么
- ❌ `git commit -m "update"` - 完全没有信息量
- ❌ `git commit -m "asdfgh"` - 乱写一通
- ❌ 每次都要想怎么写 commit 信息，浪费时间

### 解决方案

**git-commit-gen** 使用 AI 自动生成符合 [Conventional Commits](https://www.conventionalcommits.org/) 规范的 commit 信息：

- ✅ `feat(login): 添加用户登录功能` - 清晰明了
- ✅ `fix(api): 修复订单查询超时问题` - 专业规范
- ✅ `docs: 更新 README 文档` - 标准格式

### 核心价值

| 价值 | 说明 |
|------|------|
| 🕐 **节省时间** | 不用再想怎么写 commit 信息 |
| 📏 **统一规范** | 自动生成符合 Conventional Commits 的信息 |
| 🇨🇳 **中文支持** | 支持生成中文 commit 信息 |
| 🤖 **12 种 AI 模型** | 支持国内外主流大模型 |
| 📊 **历史分析** | 分析你的 commit 风格，提供改进建议 |
| 🌐 **Web 界面** | 可视化管理界面，操作更简单 |

---

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/H66666666666666/git-commit-gen.git
cd git-commit-gen

# 安装依赖
npm install

# 全局安装
npm link
```

### 配置 API Key

```bash
# 配置小米 MiMo（推荐，免费）
git-commit-gen config set-provider mimo
git-commit-gen config set-mimo-key 你的API_KEY

# 或者配置其他模型
git-commit-gen config set-provider deepseek
git-commit-gen config set-deepseek-key 你的API_KEY
```

### 使用

```bash
# 方式 1：一键提交（推荐）
git add . && git-commit-gen --language zh --auto

# 方式 2：生成信息后手动提交
git add .
git-commit-gen --language zh
# 复制生成的 commit 信息
git commit -m "feat(xxx): xxx"

# 方式 3：使用自动监听
~/bin/auto-commit
# 之后修改代码会自动提交！
```

---

## 📖 详细使用说明

### 支持的 AI 模型

| 模型 | 公司 | 特点 | API 平台 |
|------|------|------|----------|
| **MiMo** | 小米 | 推荐，免费 | xiaomimimo.com |
| **DeepSeek** | 深度求索 | 性价比高 | platform.deepseek.com |
| **Qwen** | 阿里 | 中文优秀 | dashscope.aliyuncs.com |
| **Gemini** | Google | 多模态 | makersuite.google.com |
| **Zhipu** | 智谱AI | 开源 | open.bigmodel.cn |
| **Ernie** | 百度 | 中文好 | aip.baidubce.com |
| **Doubao** | 字节跳动 | 快速 | ark.cn-beijing.volces.com |
| **Kimi** | 月之暗面 | 长文本 | api.moonshot.cn |
| **Spark** | 科大讯飞 | 语音强 | spark-api-open.xf-yun.com |
| **OpenAI** | OpenAI | GPT-4 | platform.openai.com |
| **Claude** | Anthropic | 安全 | console.anthropic.com |
| **Ollama** | 本地 | 免费 | ollama.ai |

### 命令列表

```bash
# 生成 commit 信息
git-commit-gen                    # 英文
git-commit-gen --language zh      # 中文
git-commit-gen --provider deepseek  # 指定模型
git-commit-gen --auto             # 自动提交

# 配置管理
git-commit-gen config                           # 查看配置
git-commit-gen config set-provider mimo         # 设置模型
git-commit-gen config set-mimo-key xxx          # 设置 API Key

# 历史分析
git-commit-gen history             # 分析最近 50 条
git-commit-gen history --limit 10  # 分析最近 10 条

# Git Hook
git-commit-gen --install-hook    # 安装 hook
git-commit-gen --uninstall-hook  # 卸载 hook

# Web 界面
git-commit-gen web               # 启动 Web 界面（默认端口 3000）
git-commit-gen web --port 8080   # 指定端口
```

### 实际使用示例

```bash
# 示例 1：修改了登录功能
git add src/login.ts
git-commit-gen --language zh
# 输出：feat(登录): 添加用户登录功能

# 示例 2：修复了 bug
git add src/utils.ts
git-commit-gen --language zh
# 输出：fix(工具): 修复日期格式化问题

# 示例 3：更新了文档
git add README.md
git-commit-gen --language zh
# 输出：docs: 更新项目说明文档

# 示例 4：一键提交（最简单）
git add . && git-commit-gen --language zh --auto
```

---

## 🛠️ 高级功能

### 1. 历史风格分析

```bash
# 分析你的 commit 历史
git-commit-gen history --limit 20
```

**输出示例：**
```
📊 Commit 历史分析报告
========================================

📈 总提交数: 50
📏 平均信息长度: 45 字符
🏆 最常用类型: feat

📋 类型分布:
  feat         ████████████████████ 30 (60%)
  fix          ████████ 10 (20%)
  docs         █████ 5 (10%)
  refactor     ███ 3 (6%)
  chore        ██ 2 (4%)

🎯 常见 Scope:
  - core
  - config
  - ui

💡 风格建议:
  - 信息偏长，建议精简到 50 字符以内
```

### 2. 自动监听

```bash
# 启动自动监听
~/bin/auto-commit

# 之后修改代码会自动提交！
```

### 3. Git Hook

```bash
# 安装 hook（每次 git commit 自动生成）
git-commit-gen --install-hook

# 之后每次 git commit 都会自动生成 commit 信息
```

### 4. Web 界面

```bash
# 启动 Web 界面
git-commit-gen web

# 指定端口
git-commit-gen web --port 8080
```

**访问 http://localhost:3000 即可使用可视化界面：**

- 📊 **Dashboard** - 项目概览、快速生成 commit
- 📈 **History** - commit 历史分析、图表展示
- ⚙️ **Settings** - 配置管理、API Key 设置

---

## 📁 项目结构

```
git-commit-gen/
├── src/
│   ├── index.ts              # 入口
│   ├── types.ts              # 类型定义
│   ├── commands/
│   │   ├── generate.ts       # 生成命令
│   │   ├── config.ts         # 配置命令
│   │   ├── history.ts        # 历史分析命令
│   │   └── web.ts            # Web 界面命令
│   ├── core/
│   │   ├── git.ts            # Git 操作
│   │   ├── ai.ts             # AI 调用
│   │   ├── prompt.ts         # Prompt 模板
│   │   ├── parser.ts         # 输出解析
│   │   └── history.ts        # 历史分析
│   ├── providers/            # 12 个 AI 模型
│   │   ├── openai.ts
│   │   ├── ollama.ts
│   │   ├── mimo.ts
│   │   ├── deepseek.ts
│   │   ├── qwen.ts
│   │   ├── gemini.ts
│   │   ├── zhipu.ts
│   │   ├── ernie.ts
│   │   ├── doubao.ts
│   │   ├── kimi.ts
│   │   └── spark.ts
│   ├── utils/
│   │   ├── config.ts
│   │   ├── logger.ts
│   │   └── git-hook.ts
│   └── web/
│       ├── server.ts         # Express 服务器
│       └── public/
│           └── index.html    # 前端页面
├── tests/
├── package.json
├── README.md
└── dist/
```

---

## 🧪 测试

```bash
# 运行测试
npm test

# 测试结果
✓ tests/core/git.test.ts (1 test)
✓ tests/core/parser.test.ts (9 tests)

Test Files  2 passed (2)
     Tests  10 passed (10)
```

---

## 📦 技术栈

| 技术 | 用途 |
|------|------|
| **TypeScript** | 类型安全 |
| **Commander** | CLI 框架 |
| **simple-git** | Git 操作 |
| **chalk** | 终端美化 |
| **ora** | 加载动画 |
| **Vitest** | 测试框架 |
| **tsup** | 构建工具 |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Conventional Commits](https://www.conventionalcommits.org/) - Commit 规范
- [Commander.js](https://github.com/tj/commander.js/) - CLI 框架
- [simple-git](https://github.com/steveukx/git-js) - Git 操作库

---

## 📞 联系方式

- GitHub: [H66666666666666](https://github.com/H66666666666666)
