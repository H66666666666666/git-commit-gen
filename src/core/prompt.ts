import type { GenerateOptions } from '../types.js';

export function buildPrompt(diff: string, options?: GenerateOptions): string {
  const language = options?.language === 'zh' ? '中文' : 'English';

  return `You are a Git commit message generator. Based on the following code changes, generate a commit message following the Conventional Commits specification.

Format: <type>(<scope>): <description>

Available types: feat, fix, docs, style, refactor, perf, test, build, ci, chore

Rules:
1. Be concise, no more than 72 characters
2. Use ${language}
3. Output only the commit message, no explanations
4. The type must match the nature of the change

Changes:
${diff}

Commit message:`;
}
