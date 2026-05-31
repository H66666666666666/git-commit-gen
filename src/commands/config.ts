import { Command } from 'commander';
import { saveConfig, loadConfig, getConfigPath } from '../utils/config.js';
import { getAvailableProviders } from '../core/ai.js';
import { logger } from '../utils/logger.js';
import type { ProviderName } from '../types.js';

export function configCommand(): Command {
  const cmd = new Command('config')
    .description('Manage configuration')
    .action(() => {
      const config = loadConfig();
      console.log('\nCurrent configuration:');
      console.log(JSON.stringify(config, null, 2));
      console.log('\nConfig file:', getConfigPath());
      console.log('\nAvailable providers:', getAvailableProviders().join(', '));
    });

  // 设置 provider
  cmd
    .command('set-provider')
    .description('Set AI provider')
    .argument('<provider>', 'Provider name')
    .action((provider: string) => {
      const available = getAvailableProviders();
      if (!available.includes(provider)) {
        logger.error(`Invalid provider. Available: ${available.join(', ')}`);
        process.exit(1);
      }
      saveConfig({ provider: provider as ProviderName });
      logger.success(`Provider set to: ${provider}`);
    });

  // OpenAI
  cmd
    .command('set-openai-key')
    .description('Set OpenAI API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ openaiApiKey: key });
      logger.success('OpenAI API key saved');
    });

  // Claude
  cmd
    .command('set-claude-key')
    .description('Set Claude API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ claudeApiKey: key });
      logger.success('Claude API key saved');
    });

  // Ollama
  cmd
    .command('set-ollama-model')
    .description('Set Ollama model')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ ollamaModel: model });
      logger.success(`Ollama model set to: ${model}`);
    });

  cmd
    .command('set-ollama-url')
    .description('Set Ollama API URL')
    .argument('<url>', 'API URL')
    .action((url: string) => {
      saveConfig({ ollamaUrl: url });
      logger.success(`Ollama URL set to: ${url}`);
    });

  // MiMo
  cmd
    .command('set-mimo-key')
    .description('Set MiMo API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ mimoApiKey: key });
      logger.success('MiMo API key saved');
    });

  cmd
    .command('set-mimo-model')
    .description('Set MiMo model name')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ mimoModel: model });
      logger.success(`MiMo model set to: ${model}`);
    });

  cmd
    .command('set-mimo-url')
    .description('Set MiMo API base URL')
    .argument('<url>', 'API URL')
    .action((url: string) => {
      saveConfig({ mimoBaseUrl: url });
      logger.success(`MiMo URL set to: ${url}`);
    });

  // DeepSeek
  cmd
    .command('set-deepseek-key')
    .description('Set DeepSeek API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ deepseekApiKey: key });
      logger.success('DeepSeek API key saved');
    });

  cmd
    .command('set-deepseek-model')
    .description('Set DeepSeek model')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ deepseekModel: model });
      logger.success(`DeepSeek model set to: ${model}`);
    });

  // Qwen (通义千问)
  cmd
    .command('set-qwen-key')
    .description('Set Qwen (通义千问) API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ qwenApiKey: key });
      logger.success('Qwen API key saved');
    });

  cmd
    .command('set-qwen-model')
    .description('Set Qwen model')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ qwenModel: model });
      logger.success(`Qwen model set to: ${model}`);
    });

  // Gemini
  cmd
    .command('set-gemini-key')
    .description('Set Gemini API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ geminiApiKey: key });
      logger.success('Gemini API key saved');
    });

  cmd
    .command('set-gemini-model')
    .description('Set Gemini model')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ geminiModel: model });
      logger.success(`Gemini model set to: ${model}`);
    });

  // Zhipu (智谱清言)
  cmd
    .command('set-zhipu-key')
    .description('Set Zhipu (智谱清言) API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ zhipuApiKey: key });
      logger.success('Zhipu API key saved');
    });

  cmd
    .command('set-zhipu-model')
    .description('Set Zhipu model')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ zhipuModel: model });
      logger.success(`Zhipu model set to: ${model}`);
    });

  // Ernie (文心一言)
  cmd
    .command('set-ernie-key')
    .description('Set Ernie (文心一言) API key and secret key')
    .argument('<apiKey>', 'API key')
    .argument('<secretKey>', 'Secret key')
    .action((apiKey: string, secretKey: string) => {
      saveConfig({ ernieApiKey: apiKey, ernieSecretKey: secretKey });
      logger.success('Ernie API key saved');
    });

  cmd
    .command('set-ernie-model')
    .description('Set Ernie model')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ ernieModel: model });
      logger.success(`Ernie model set to: ${model}`);
    });

  // Doubao (豆包)
  cmd
    .command('set-doubao-key')
    .description('Set Doubao (豆包) API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ doubaoApiKey: key });
      logger.success('Doubao API key saved');
    });

  cmd
    .command('set-doubao-model')
    .description('Set Doubao model')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ doubaoModel: model });
      logger.success(`Doubao model set to: ${model}`);
    });

  // Kimi
  cmd
    .command('set-kimi-key')
    .description('Set Kimi API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ kimiApiKey: key });
      logger.success('Kimi API key saved');
    });

  cmd
    .command('set-kimi-model')
    .description('Set Kimi model')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ kimiModel: model });
      logger.success(`Kimi model set to: ${model}`);
    });

  // Spark (讯飞星火)
  cmd
    .command('set-spark-key')
    .description('Set Spark (讯飞星火) API key and app ID')
    .argument('<apiKey>', 'API key')
    .argument('<appId>', 'App ID')
    .action((apiKey: string, appId: string) => {
      saveConfig({ sparkApiKey: apiKey, sparkAppId: appId });
      logger.success('Spark API key saved');
    });

  cmd
    .command('set-spark-model')
    .description('Set Spark model')
    .argument('<model>', 'Model name')
    .action((model: string) => {
      saveConfig({ sparkModel: model });
      logger.success(`Spark model set to: ${model}`);
    });

  return cmd;
}
