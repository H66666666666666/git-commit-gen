import type { AIProvider, GenerateOptions } from '../types.js';
import { loadConfig } from '../utils/config.js';
import { buildPrompt } from '../core/prompt.js';

export class SparkProvider implements AIProvider {
  name = 'spark';

  async generateCommitMessage(diff: string, options?: GenerateOptions): Promise<string> {
    const config = loadConfig();
    const apiKey = config.sparkApiKey || process.env.SPARK_API_KEY;
    const appId = config.sparkAppId || process.env.SPARK_APP_ID;
    const model = config.sparkModel || 'generalv3.5';

    if (!apiKey || !appId) {
      throw new Error('Spark API key not configured. Run: git-commit-gen config --set-spark-key <apiKey> <appId>');
    }

    const prompt = buildPrompt(diff, options);

    // 讯飞星火使用 WebSocket，这里用 HTTP 兼容接口
    const response = await fetch('https://spark-api-open.xf-yun.com/v1/chat/completions', {
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
      throw new Error(`Spark API error: ${error}`);
    }

    const data = await response.json();
    return (data.choices?.[0]?.message?.content || 'chore: update code').trim();
  }
}
