import { app } from 'electron';
import debug from 'debug';
import logger from './loggger';
import * as window from './window';
import * as ipc from './ipc';

const d = debug('updater:main');

d('Starting Application!');
logger.info('Starting Application!');

app.on('ready', () => {
  d('Creating main window');
  window.create();

  d('Initializing IPC');
  ipc.init();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  d('Creating main window');
  window.create();
});
