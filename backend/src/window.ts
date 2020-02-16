import path from 'path';
import url from 'url';
import { BrowserWindow } from 'electron';
import { START_URL, IS_DEV } from './constants';

let mainWindow: BrowserWindow | null;

export function create() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(START_URL);

  if (IS_DEV) mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

export function getMainWindow() {
  return mainWindow;
}
