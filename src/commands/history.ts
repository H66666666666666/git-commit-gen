import { Command } from 'commander';
import { getCommitHistory, formatHistoryReport } from '../core/history.js';
import { logger } from '../utils/logger.js';

export function historyCommand(): Command {
  const cmd = new Command('history')
    .description('Analyze commit history and style')
    .option('-n, --limit <number>', 'Number of commits to analyze', '50')
    .action(async (options) => {
      try {
        const limit = parseInt(options.limit, 10);
        if (isNaN(limit) || limit <= 0) {
          logger.error('Limit must be a positive number');
          process.exit(1);
        }

        logger.info(`Analyzing last ${limit} commits...`);
        const history = await getCommitHistory(limit);

        if (history.messages.length === 0) {
          logger.warn('No commits found in this repository.');
          return;
        }

        const report = formatHistoryReport(history);
        console.log(report);
      } catch (error) {
        logger.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return cmd;
}
