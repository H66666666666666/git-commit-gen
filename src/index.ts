#!/usr/bin/env node

import { Command } from 'commander';
import { generateCommand } from './commands/generate.js';
import { configCommand } from './commands/config.js';
import { historyCommand } from './commands/history.js';
import { installHook, uninstallHook } from './utils/git-hook.js';
import { isGitRepo } from './core/git.js';
import { logger } from './utils/logger.js';

const program = new Command();

program
  .name('git-commit-gen')
  .description('AI-powered Git commit message generator')
  .version('1.0.0');

program
  .option('-p, --provider <provider>', 'AI provider (openai, claude, ollama)', 'openai')
  .option('-a, --auto', 'Auto commit after generating message', false)
  .option('-l, --language <language>', 'Output language (en, zh)', 'en')
  .option('--install-hook', 'Install as Git prepare-commit-msg hook')
  .option('--uninstall-hook', 'Uninstall Git hook')
  .action(async (options) => {
    const isRepo = await isGitRepo();
    if (!isRepo) {
      logger.error('Not a git repository. Run this command inside a git project.');
      process.exit(1);
    }

    if (options.installHook) {
      await installHook();
      logger.success('Git hook installed! Will auto-generate commit messages on "git commit".');
      return;
    }

    if (options.uninstallHook) {
      await uninstallHook();
      logger.success('Git hook uninstalled.');
      return;
    }

    await generateCommand({
      provider: options.provider !== 'openai' ? options.provider : undefined,
      auto: options.auto,
      language: options.language,
    });
  });

program.addCommand(configCommand());
program.addCommand(historyCommand());

program.parse();
