#!/bin/bash
# auto-commit.sh
# 监听文件变化，自动提交

echo "🚀 启动自动提交监听..."
echo "📁 监听目录: $(pwd)"
echo "⏹️  按 Ctrl+C 停止"
echo ""

# 使用 fswatch 监听文件变化（macOS/Linux）
# Windows 使用 inotifywait 或 PowerShell

# 方法 1: 使用 find + sleep 循环
while true; do
  # 检查是否有文件变化
  CHANGED=$(git status --porcelain)

  if [ -n "$CHANGED" ]; then
    echo "📝 检测到文件变化，自动提交..."
    git add . && git-commit-gen --language zh --auto
    echo ""
  fi

  sleep 5  # 每 5 秒检查一次
done
