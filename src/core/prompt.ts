import type { GenerateOptions } from '../types.js';

export function buildPrompt(diff: string, options?: GenerateOptions): string {
  const isZh = options?.language === 'zh';

  if (isZh) {
    return `你是一个 Git commit 信息生成器。根据以下代码变更，生成符合 Conventional Commits 规范的 commit 信息。

格式：<type>(<scope>): <description>

可用的 type: feat, fix, docs, style, refactor, perf, test, build, ci, chore

规则：
1. 简洁明了，不超过 72 个字符
2. description 部分使用中文
3. 只输出 commit 信息，不要解释
4. type 必须是英文，scope 和 description 可以是中文

变更内容：
${diff.slice(0, 3000)}

Commit 信息：`;
  }

  return `You are a Git commit message generator. Based on the following code changes, generate a commit message following the Conventional Commits specification.

Format: <type>(<scope>): <description>

Available types: feat, fix, docs, style, refactor, perf, test, build, ci, chore

Rules:
1. Be concise, no more than 72 characters
2. Use English
3. Output only the commit message, no explanations
4. The type must match the nature of the change

Changes:
${diff.slice(0, 3000)}

Commit message:`;
}
