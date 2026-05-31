import OpenAI from 'openai';
import type { AIProvider, GenerateOptions } from '../types.js';
import { loadConfig } from '../utils/config.js';
import { buildPrompt } from '../core/prompt.js';

export class OpenAIProvider implements AIProvider {
  name = 'openai';

  async generateCommitMessage(diff: string, options?: GenerateOptions): Promise<string> {
    const config = loadConfig();
    const apiKey = config.openaiApiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OpenAI API key not configured. Run: git-commit-gen config --set-openai-key <key>');
    }

    const openai = new OpenAI({ apiKey });
    const prompt = buildPrompt(diff, options);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
      max_tokens: 100,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content?.trim() || 'chore: update code';
  }
}
