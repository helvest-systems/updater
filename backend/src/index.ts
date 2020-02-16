import debug from 'debug';
import logger from './loggger';
import * as app from './app';

const d = debug('updater:main');

process
  .on('uncaughtException', error => {
    d('UNCAUGHT EXCEPTION', error);
    logger.error('UNCAUGHT EXCEPTION', { kind: error.name, reason: error.message, error });
  })
  .on('unhandledRejection', (reason, promise) => {
    d('UNHANDLED REJECTION', reason);
    logger.error('UNHANDLED REJECTION', { reason, promise });
  });

app.start();
