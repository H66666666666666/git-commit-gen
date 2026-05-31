import type { AIProvider, GenerateOptions } from '../types.js';
import { loadConfig } from '../utils/config.js';
import { buildPrompt } from '../core/prompt.js';

export class ErnieProvider implements AIProvider {
  name = 'ernie';

  async generateCommitMessage(diff: string, options?: GenerateOptions): Promise<string> {
    const config = loadConfig();
    const apiKey = config.ernieApiKey || process.env.ERNIE_API_KEY;
    const secretKey = config.ernieSecretKey || process.env.ERNIE_SECRET_KEY;
    const model = config.ernieModel || 'ernie-speed-128k';

    if (!apiKey || !secretKey) {
      throw new Error('Ernie API key not configured. Run: git-commit-gen config --set-ernie-key <apiKey> <secretKey>');
    }

    const prompt = buildPrompt(diff, options);

    // 获取 access_token
    const tokenResponse = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
      { method: 'POST' }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Ernie access token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const response = await fetch(
      `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${model}?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `You are a Git commit message generator. Output only the commit message, no explanations.\n\n${prompt}`,
            },
          ],
          max_output_tokens: 150,
          temperature: 0.3,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ernie API error: ${error}`);
    }

    const data = await response.json();
    return (data.result || 'chore: update code').trim();
  }
}
