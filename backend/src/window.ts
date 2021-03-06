import path from 'path';
import debug from 'debug';
import { BrowserWindow } from 'electron';
import * as constants from './constants';

const d = debug('updater:window');

let window: BrowserWindow | null;

export function create() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 600,
    height: 212,
    useContentSize: true,
    backgroundColor: '#1e1e24',
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    maximizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  window.loadURL(constants.START_URL);

  if (constants.DEV) {
    window.webContents.openDevTools({ mode: 'detach' });
  }

  window.on('closed', () => {
    d('App Window closed');
    window = null;
  });

  window.on('ready-to-show', () => {
    d('Window is ready to show');
    window!.show();
  });
}

export function getWindow() {
  return window;
}

export function emit(event: string, ...args: any[]) {
  if (!window) return;
  window.webContents.send(event, ...args);
}
