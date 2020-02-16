import path from 'path';
import { app } from 'electron';

// App Environment
export const ENV = process.env.NODE_ENV || 'production';
export const IS_DEV = ENV === 'development';

// App Paths
export const USER_PATH = app.getPath('userData');
export const UPDATES_PATH = path.join(USER_PATH, 'updates');

export const UPDATES_REPO_URL = 'https://bitbucket.org/AWEL-GmbH/updates/get/master.zip';

export const FRONTEND_DIR = path.join(__dirname, 'frontend');
export const START_URL = IS_DEV
  ? 'http://localhost:3000'
  : `file://${path.resolve(FRONTEND_DIR, './index.html')}`;
