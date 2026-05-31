# git-commit-gen

AI-powered Git commit message generator that follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Features

- 🤖 **12 AI Providers** - OpenAI, Claude, Ollama, MiMo, DeepSeek, Qwen, Gemini, Zhipu, Ernie, Doubao, Kimi, Spark
- 📝 **Conventional Commits** - Generates properly formatted commit messages
- 🪝 **Git Hook Integration** - Auto-generate on `git commit`
- 🌏 **Chinese Support** - Generate commit messages in Chinese
- 📊 **History Analysis** - Analyze commit history and style
- ⚡ **Fast & Lightweight** - Built with TypeScript, runs on Node.js
- 🎨 **Beautiful CLI** - Colored output with spinners

## Installation

```bash
npm install -g git-commit-gen
```

## Quick Start

```bash
# Stage your changes
git add .

# Generate commit message
git-commit-gen

# Generate in Chinese
git-commit-gen --language zh

# Auto-commit with generated message
git-commit-gen --auto
```

## Supported AI Providers

| Provider | Model | API Platform |
|----------|-------|--------------|
| **OpenAI** | gpt-4o-mini | platform.openai.com |
| **Claude** | claude-3-haiku | console.anthropic.com |
| **Ollama** | codellama | ollama.ai (local) |
| **MiMo** | mimo-v2.5-pro | xiaomimimo.com |
| **DeepSeek** | deepseek-chat | platform.deepseek.com |
| **Qwen** | qwen-turbo | dashscope.aliyuncs.com |
| **Gemini** | gemini-pro | makersuite.google.com |
| **Zhipu** | glm-4-flash | open.bigmodel.cn |
| **Ernie** | ernie-speed-128k | aip.baidubce.com |
| **Doubao** | doubao-lite-4k | ark.cn-beijing.volces.com |
| **Kimi** | moonshot-v1-8k | api.moonshot.cn |
| **Spark** | generalv3.5 | spark-api-open.xf-yun.com |

## Configuration

```bash
# Set provider
git-commit-gen config set-provider mimo

# Set API keys
git-commit-gen config set-openai-key sk-xxx
git-commit-gen config set-deepseek-key sk-xxx
git-commit-gen config set-qwen-key sk-xxx
git-commit-gen config set-gemini-key AIzaSyxxx
git-commit-gen config set-zhipu-key xxx
git-commit-gen config set-ernie-key <apiKey> <secretKey>
git-commit-gen config set-doubao-key xxx
git-commit-gen config set-kimi-key sk-xxx
git-commit-gen config set-spark-key <apiKey> <appId>
git-commit-gen config set-mimo-key tp-xxx

# Set models
git-commit-gen config set-deepseek-model deepseek-coder
git-commit-gen config set-qwen-model qwen-plus
git-commit-gen config set-gemini-model gemini-pro
git-commit-gen config set-mimo-model mimo-v2.5-pro

# View current config
git-commit-gen config
```

## Usage

### Generate Commit Message

```bash
# Basic usage (English)
git-commit-gen

# Chinese output
git-commit-gen --language zh

# Use specific provider
git-commit-gen --provider deepseek
git-commit-gen --provider qwen
git-commit-gen --provider mimo

# Auto-commit
git-commit-gen --auto
```

### Git Hook Setup

```bash
# Install hook
git-commit-gen --install-hook

# Now just use git commit as normal
git commit
# Commit message will be auto-generated!

# Uninstall hook
git-commit-gen --uninstall-hook
```

### History Analysis

```bash
# Analyze last 50 commits
git-commit-gen history

# Analyze last 10 commits
git-commit-gen history --limit 10
```

**Example Output:**
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

## Options

```
Usage: git-commit-gen [options] [command]

Options:
  -V, --version              output the version number
  -p, --provider <provider>  AI provider (openai, claude, ollama, mimo, deepseek, qwen, gemini, zhipu, ernie, doubao, kimi, spark)
  -a, --auto                 Auto commit after generating message (default: false)
  -l, --language <language>  Output language (en, zh) (default: "en")
  --install-hook             Install as Git prepare-commit-msg hook
  --uninstall-hook           Uninstall Git hook
  -h, --help                 display help for command

Commands:
  config                     Manage configuration
  history [options]          Analyze commit history and style
```

## Examples

```bash
# Generate with MiMo (小米)
git-commit-gen --provider mimo --language zh

# Generate with DeepSeek
git-commit-gen --provider deepseek

# Generate with Qwen (通义千问)
git-commit-gen --provider qwen --language zh

# Analyze commit history
git-commit-gen history --limit 20

# Auto-commit with specific provider
git-commit-gen --provider mimo --auto
```

## Development

```bash
# Clone the repo
git clone https://github.com/yourusername/git-commit-gen.git
cd git-commit-gen

# Install dependencies
npm install

# Run in dev mode
npm run dev

# Run tests
npm test

# Build
npm run build
```

## License

MIT
