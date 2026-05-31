import ora from 'ora';
import simpleGit from 'simple-git';
import { getStagedDiff, hasStagedChanges } from '../core/git.js';
import { generateCommitMessage } from '../core/ai.js';
import { loadConfig } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import type { GenerateOptions } from '../types.js';

const git = simpleGit();

export async function generateCommand(options: GenerateOptions): Promise<void> {
  const hasStaged = await hasStagedChanges();
  if (!hasStaged) {
    logger.warn('No staged changes found. Stage files with "git add" first.');
    process.exit(1);
  }

  const config = loadConfig();
  const mergedOptions: GenerateOptions = {
    provider: options.provider || config.provider,
    language: options.language || config.language,
  };

  const spinner = ora('Analyzing staged changes...').start();

  try {
    const diff = await getStagedDiff();
    spinner.text = `Found ${diff.files.length} changed file(s), +${diff.insertions} -${diff.deletions}`;

    spinner.text = 'Generating commit message with AI...';
    const message = await generateCommitMessage(diff.staged, mergedOptions);

    spinner.stop();
    logger.commit(message);

    if (options.auto) {
      const confirmSpinner = ora('Committing...').start();
      await git.commit(message);
      confirmSpinner.succeed('Committed successfully!');
    } else {
      logger.info('To commit, run:');
      console.log(`  git commit -m "${message}"`);
      console.log('');
      logger.info('Or use --auto flag to commit directly:');
      console.log('  git-commit-gen --auto');
    }
  } catch (error) {
    spinner.fail('Failed to generate commit message');
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
