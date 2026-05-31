import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { Config } from '../types.js';

const CONFIG_FILE = path.join(os.homedir(), '.git-commit-gen.json');

const DEFAULT_CONFIG: Config = {
  provider: 'openai',
  language: 'en',
};

export function loadConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_CONFIG };
}

export function saveConfig(config: Partial<Config>): void {
  const current = loadConfig();
  const updated = { ...current, ...config };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2));
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}
