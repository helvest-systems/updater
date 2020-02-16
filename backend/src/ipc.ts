import debug from 'debug';
import { ipcMain, app } from 'electron';
import * as window from './window';
import * as update from './update';
import logger from './loggger';
import Client from './bootloader';

const d = debug('updater:ipc');

const client = new Client();
let deviceData: DeviceData | undefined;

export function init() {
  ipcMain.on('connection/start', async event => {
    try {
      deviceData = await client.connect();
      event.reply('connection/connected', deviceData);

      d('Device %o successfully connected', deviceData);
      // logger.info(`Device ${JSON.stringify(deviceData)} successfully connected`);
    } catch (err) {
      d('Connection failed due to %O', err);
      // logger.warn(`Connection failed due to: ${err}`);
      event.reply('connection/failed');
    }
  });

  ipcMain.on('update/check', async event => {
    const updateAvailable = await update.checkFirmwareUpdates(deviceData!);

    if (updateAvailable) {
      const version = update.getUpdateVersion();
      console.log(update.getFilePath());
      event.reply('update/available', { version });
    } else {
      event.reply('update/unavailable');
    }
  });

  ipcMain.on('update/install', async event => {
    const mainWindow = window.getWindow();

    client.onFlashing = progress => {
      mainWindow?.webContents.send('update/installing', { progress });
    };

    try {
      await client.flash(update.getFilePath());
      event.reply('update/installed');
    } catch (err) {
      console.log(err);
      event.reply('update/failed');
    }
  });

  ipcMain.on('app/quit', () => app.quit());
}
