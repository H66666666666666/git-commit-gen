export interface GenerateOptions {
  provider?: 'openai' | 'claude' | 'ollama' | 'mimo';
  auto?: boolean;
  language?: 'en' | 'zh';
}

export interface AIProvider {
  name: string;
  generateCommitMessage(diff: string, options?: GenerateOptions): Promise<string>;
}

export interface Config {
  provider: 'openai' | 'claude' | 'ollama' | 'mimo';
  openaiApiKey?: string;
  claudeApiKey?: string;
  ollamaModel?: string;
  ollamaUrl?: string;
  mimoApiKey?: string;
  mimoBaseUrl?: string;
  mimoModel?: string;
  language: 'en' | 'zh';
}

export interface GitDiff {
  staged: string;
  files: string[];
  insertions: number;
  deletions: number;
}
