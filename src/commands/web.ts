import { Command } from 'commander';
import { startWebServer } from '../web/server.js';
import { logger } from '../utils/logger.js';

export function webCommand(): Command {
  const cmd = new Command('web')
    .description('Start web interface')
    .option('-p, --port <port>', 'Port number', '3000')
    .action((options) => {
      const port = parseInt(options.port, 10);
      if (isNaN(port) || port <= 0 || port > 65535) {
        logger.error('Invalid port number');
        process.exit(1);
      }

      logger.info(`Starting web server on port ${port}...`);
      startWebServer(port);
    });

  return cmd;
}
