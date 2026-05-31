export type ProviderName =
  | 'openai'
  | 'claude'
  | 'ollama'
  | 'mimo'
  | 'deepseek'
  | 'qwen'
  | 'gemini'
  | 'zhipu'
  | 'ernie'
  | 'doubao'
  | 'kimi'
  | 'spark';

export interface GenerateOptions {
  provider?: ProviderName;
  auto?: boolean;
  language?: 'en' | 'zh';
}

export interface AIProvider {
  name: string;
  generateCommitMessage(diff: string, options?: GenerateOptions): Promise<string>;
}

export interface Config {
  provider: ProviderName;
  language: 'en' | 'zh';

  // OpenAI
  openaiApiKey?: string;

  // Claude
  claudeApiKey?: string;

  // Ollama
  ollamaModel?: string;
  ollamaUrl?: string;

  // MiMo
  mimoApiKey?: string;
  mimoBaseUrl?: string;
  mimoModel?: string;

  // DeepSeek
  deepseekApiKey?: string;
  deepseekBaseUrl?: string;
  deepseekModel?: string;

  // Qwen (通义千问)
  qwenApiKey?: string;
  qwenBaseUrl?: string;
  qwenModel?: string;

  // Gemini
  geminiApiKey?: string;
  geminiModel?: string;

  // Zhipu (智谱清言)
  zhipuApiKey?: string;
  zhipuModel?: string;

  // Ernie (文心一言)
  ernieApiKey?: string;
  ernieSecretKey?: string;
  ernieModel?: string;

  // Doubao (豆包)
  doubaoApiKey?: string;
  doubaoBaseUrl?: string;
  doubaoModel?: string;

  // Kimi
  kimiApiKey?: string;
  kimiBaseUrl?: string;
  kimiModel?: string;

  // Spark (讯飞星火)
  sparkApiKey?: string;
  sparkAppId?: string;
  sparkModel?: string;
}

export interface GitDiff {
  staged: string;
  files: string[];
  insertions: number;
  deletions: number;
}
