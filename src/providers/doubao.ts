import type { AIProvider, GenerateOptions } from '../types.js';
import { loadConfig } from '../utils/config.js';
import { buildPrompt } from '../core/prompt.js';

export class DoubaoProvider implements AIProvider {
  name = 'doubao';

  async generateCommitMessage(diff: string, options?: GenerateOptions): Promise<string> {
    const config = loadConfig();
    const apiKey = config.doubaoApiKey || process.env.DOUBAO_API_KEY;
    const baseUrl = config.doubaoBaseUrl || 'https://ark.cn-beijing.volces.com/api/v3';
    const model = config.doubaoModel || 'doubao-lite-4k';

    if (!apiKey) {
      throw new Error('Doubao API key not configured. Run: git-commit-gen config --set-doubao-key <key>');
    }

    const prompt = buildPrompt(diff, options);

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
      throw new Error(`Doubao API error: ${error}`);
    }

    const data = await response.json();
    return (data.choices?.[0]?.message?.content || 'chore: update code').trim();
  }
}
