import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import debug from 'debug';
import logger from './loggger';
import * as window from './window';
import * as ipc from './ipc';
import { ENV } from './constants';

autoUpdater.on('update-downloaded', () => autoUpdater.quitAndInstall());

const d = debug('updater:main');

export function start() {
  d('Application started in %s', ENV);
  logger.info('Application started', { ENV });

  app.on('ready', async () => {
    try {
      await autoUpdater.checkForUpdatesAndNotify();
    } catch (err) {
      d('Error while updating the updater -.-');
      logger.error('An error occure while updating the app', err);
    }

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
}
