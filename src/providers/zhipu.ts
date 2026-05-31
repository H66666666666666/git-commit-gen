import type { AIProvider, GenerateOptions } from '../types.js';
import { loadConfig } from '../utils/config.js';
import { buildPrompt } from '../core/prompt.js';

export class ZhipuProvider implements AIProvider {
  name = 'zhipu';

  async generateCommitMessage(diff: string, options?: GenerateOptions): Promise<string> {
    const config = loadConfig();
    const apiKey = config.zhipuApiKey || process.env.ZHIPU_API_KEY;
    const model = config.zhipuModel || 'glm-4-flash';

    if (!apiKey) {
      throw new Error('Zhipu API key not configured. Run: git-commit-gen config --set-zhipu-key <key>');
    }

    const prompt = buildPrompt(diff, options);

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a Git commit message generator. Output only the commit message, no explanations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Zhipu API error: ${error}`);
    }

    const data = await response.json();
    return (data.choices?.[0]?.message?.content || 'chore: update code').trim();
  }
}
