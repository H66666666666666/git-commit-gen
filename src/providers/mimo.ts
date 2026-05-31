import type { AIProvider, GenerateOptions } from '../types.js';
import { loadConfig } from '../utils/config.js';

export class MimoProvider implements AIProvider {
  name = 'mimo';

  async generateCommitMessage(diff: string, options?: GenerateOptions): Promise<string> {
    const config = loadConfig();
    const apiKey = config.mimoApiKey || process.env.MIMO_API_KEY;
    const baseUrl = config.mimoBaseUrl || 'https://token-plan-cn.xiaomimimo.com/v1';
    const model = config.mimoModel || 'mimo-v2.5-pro';

    if (!apiKey) {
      throw new Error('MiMo API key not configured. Run: git-commit-gen config --set-mimo-key <key>');
    }

    const isZh = options?.language === 'zh';

    // MiMo is a reasoning model, needs simpler prompt and more tokens
    const prompt = isZh
      ? `为以下代码变更生成 Git commit 信息。格式：type(scope): description。type 必须是英文，scope 和 description 用中文。只输出 commit 信息，不要其他内容。type 类型：feat, fix, docs, style, refactor, perf, test, build, ci, chore

${diff.slice(0, 3000)}`
      : `Write a git commit message for these changes. Use format: type(scope): description. Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore. Only write the commit message, nothing else.

${diff.slice(0, 3000)}`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MiMo API error: ${error}`);
    }

    const data = await response.json();
    return (data.choices?.[0]?.message?.content || 'chore: update code').trim();
  }
}
