import type { AIProvider, GenerateOptions } from '../types.js';
import { loadConfig } from '../utils/config.js';
import { buildPrompt } from '../core/prompt.js';

export class GeminiProvider implements AIProvider {
  name = 'gemini';

  async generateCommitMessage(diff: string, options?: GenerateOptions): Promise<string> {
    const config = loadConfig();
    const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;
    const model = config.geminiModel || 'gemini-pro';

    if (!apiKey) {
      throw new Error('Gemini API key not configured. Run: git-commit-gen config --set-gemini-key <key>');
    }

    const prompt = buildPrompt(diff, options);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a Git commit message generator. Output only the commit message, no explanations.\n\n${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.3,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    return (data.candidates?.[0]?.content?.parts?.[0]?.text || 'chore: update code').trim();
  }
}
