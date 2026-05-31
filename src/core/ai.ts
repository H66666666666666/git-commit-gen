import type { AIProvider, GenerateOptions } from '../types.js';
import { OpenAIProvider } from '../providers/openai.js';
import { OllamaProvider } from '../providers/ollama.js';
import { buildPrompt } from './prompt.js';
import { parseCommitMessage, isValidConventionalCommit, suggestFix } from './parser.js';

const providers: Record<string, AIProvider> = {};

export function registerProvider(provider: AIProvider): void {
  providers[provider.name] = provider;
}

export function getProvider(name: string): AIProvider | undefined {
  return providers[name];
}

export async function generateCommitMessage(
  diff: string,
  options?: GenerateOptions
): Promise<string> {
  const providerName = options?.provider || 'openai';
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(`Provider "${providerName}" not found. Available: ${Object.keys(providers).join(', ')}`);
  }

  const prompt = buildPrompt(diff, options);
  const rawMessage = await provider.generateCommitMessage(diff, options);
  const message = parseCommitMessage(rawMessage);

  if (isValidConventionalCommit(message)) {
    return message;
  }

  return suggestFix(message);
}

registerProvider(new OpenAIProvider());
registerProvider(new OllamaProvider());
