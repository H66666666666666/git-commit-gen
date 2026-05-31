# git-commit-gen

AI-powered Git commit message generator that follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Features

- 🤖 **AI-Powered** - Uses OpenAI, Claude, or local Ollama models
- 📝 **Conventional Commits** - Generates properly formatted commit messages
- 🪝 **Git Hook Integration** - Auto-generate on `git commit`
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

# Auto-commit with generated message
git-commit-gen --auto
```

## Configuration

```bash
# Set OpenAI API key
git-commit-gen config set-openai-key sk-xxx

# Use Ollama (local)
git-commit-gen config set-provider ollama
git-commit-gen config set-ollama-model codellama

# View current config
git-commit-gen config
```

## Git Hook Setup

Install as a Git hook to auto-generate commit messages:

```bash
# Install hook
git-commit-gen --install-hook

# Now just use git commit as normal
git commit
# Commit message will be auto-generated!

# Uninstall hook
git-commit-gen --uninstall-hook
```

## Options

```
Usage: git-commit-gen [options]

Options:
  -p, --provider <provider>  AI provider (openai, claude, ollama) (default: "openai")
  -a, --auto                 Auto commit after generating message (default: false)
  -l, --language <language>  Output language (en, zh) (default: "en")
  --install-hook             Install as Git prepare-commit-msg hook
  --uninstall-hook           Uninstall Git hook
  -V, --version              output the version number
  -h, --help                 display help for command
```

## Examples

```bash
# Basic usage
$ git-commit-gen
✔ Generated commit message:
  feat(auth): add user login functionality

# With auto-commit
$ git-commit-gen --auto
✔ Committed successfully!

# Use different provider
$ git-commit-gen --provider ollama

# Chinese output
$ git-commit-gen --language zh
```

## Supported AI Providers

| Provider | Model | Requirements |
|----------|-------|--------------|
| OpenAI | gpt-4o-mini | API Key |
| Claude | claude-3-haiku | API Key |
| Ollama | codellama (default) | Local Ollama server |

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
