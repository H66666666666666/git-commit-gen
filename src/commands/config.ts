import { Command } from 'commander';
import { saveConfig, loadConfig, getConfigPath } from '../utils/config.js';
import { logger } from '../utils/logger.js';

export function configCommand(): Command {
  const cmd = new Command('config')
    .description('Manage configuration')
    .action(() => {
      const config = loadConfig();
      console.log('\nCurrent configuration:');
      console.log(JSON.stringify(config, null, 2));
      console.log('\nConfig file:', getConfigPath());
    });

  cmd
    .command('set-provider')
    .description('Set AI provider (openai, claude, ollama, mimo)')
    .argument('<provider>', 'Provider name')
    .action((provider: string) => {
      if (!['openai', 'claude', 'ollama', 'mimo'].includes(provider)) {
        logger.error('Invalid provider. Use: openai, claude, ollama, or mimo');
        process.exit(1);
      }
      saveConfig({ provider: provider as 'openai' | 'claude' | 'ollama' | 'mimo' });
      logger.success(`Provider set to: ${provider}`);
    });

  cmd
    .command('set-openai-key')
    .description('Set OpenAI API key')
    .argument('<key>', 'API key')
    .action((key: string) => {
      saveConfig({ openaiApiKey: key });
      logger.success('OpenAI API key saved');
    });

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

  return cmd;
}
