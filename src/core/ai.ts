import type { AIProvider, GenerateOptions, ProviderName } from '../types.js';
import { OpenAIProvider } from '../providers/openai.js';
import { OllamaProvider } from '../providers/ollama.js';
import { MimoProvider } from '../providers/mimo.js';
import { DeepSeekProvider } from '../providers/deepseek.js';
import { QwenProvider } from '../providers/qwen.js';
import { GeminiProvider } from '../providers/gemini.js';
import { ZhipuProvider } from '../providers/zhipu.js';
import { ErnieProvider } from '../providers/ernie.js';
import { DoubaoProvider } from '../providers/doubao.js';
import { KimiProvider } from '../providers/kimi.js';
import { SparkProvider } from '../providers/spark.js';
import { buildPrompt } from './prompt.js';
import { parseCommitMessage, isValidConventionalCommit, suggestFix } from './parser.js';

const providers: Record<string, AIProvider> = {};

export function registerProvider(provider: AIProvider): void {
  providers[provider.name] = provider;
}

export function getProvider(name: string): AIProvider | undefined {
  return providers[name];
}

export function getAvailableProviders(): string[] {
  return Object.keys(providers);
}

export async function generateCommitMessage(
  diff: string,
  options?: GenerateOptions
): Promise<string> {
  const providerName = options?.provider || 'openai';
  const provider = providers[providerName];

  if (!provider) {
    throw new Error(
      `Provider "${providerName}" not found. Available: ${Object.keys(providers).join(', ')}`
    );
  }

  const rawMessage = await provider.generateCommitMessage(diff, options);
  const message = parseCommitMessage(rawMessage);

  if (isValidConventionalCommit(message)) {
    return message;
  }

  return suggestFix(message);
}

// 注册所有 provider
registerProvider(new OpenAIProvider());
registerProvider(new OllamaProvider());
registerProvider(new MimoProvider());
registerProvider(new DeepSeekProvider());
registerProvider(new QwenProvider());
registerProvider(new GeminiProvider());
registerProvider(new ZhipuProvider());
registerProvider(new ErnieProvider());
registerProvider(new DoubaoProvider());
registerProvider(new KimiProvider());
registerProvider(new SparkProvider());
