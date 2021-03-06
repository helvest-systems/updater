import path from 'path';
import { app } from 'electron';

// App Environment
export const ENV = process.env.NODE_ENV || 'production';
export const DEV = ENV === 'development';

// Platform
export const PLATFORM = process.platform;
export const MAC = PLATFORM === 'darwin';
export const WIN = PLATFORM === 'win32';
export const LINUX = PLATFORM === 'linux';

// App Paths
export const USER_PATH = app.getPath('userData');
export const LOG_PATH = path.join(USER_PATH, 'logs');
export const CACHE_PATH = path.join(USER_PATH, 'updates-cache');

export const UPDATES_REPO_URL = 'https://bitbucket.org/AWEL-GmbH/updates/get/master.zip';

export const START_URL = DEV
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, 'index.html')}`;
