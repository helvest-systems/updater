import path from 'path';
import fs from 'fs';
import debug from 'debug';
import isOnline from 'is-online';
import { fetch, extract } from 'gitly';
import rimraf from 'rimraf';
import * as window from './window';
import logger from './loggger';
import { CACHE_PATH } from './constants';

const d = debug('updater:update');

type UpdateData = Omit<DeviceData, 'fwVersion'> & {
  version: string;
  file: string;
  checksum: string;
};

const REPO = 'bitbucket:AWEL-GmbH/updates';

let update: UpdateData | null = null;

export async function checkFirmwareUpdates({ model, hwVersion, fwVersion }: DeviceData) {
  const online = await isOnline();

  if (online) {
    logger.info('App online, start cache update');
    await updateCache();
  } else {
    logger.info('App is offline, try to use cached updates');
    window.emit('app/is-offline');
  }

  const manifestJson = path.join(CACHE_PATH, `${model}/${hwVersion}/manifest.json`);
  if (!fs.existsSync(manifestJson)) {
    logger.info('Cache is empty or manifest file was deleted');
    window.emit('update/cache-is-empty');
    return;
  }

  const content = fs.readFileSync(manifestJson);
  const updates = JSON.parse(content.toString());

  if (updates[0].version == fwVersion) {
    logger.info('Update unavailable');
    return false;
  } else {
    update = { model, hwVersion, ...updates[0] };
    logger.info('Update available', update);
    return true;
  }
}

export function getUpdateVersion() {
  return update?.version;
}

export function getFilePath() {
  const { model, hwVersion, file } = update!;
  return path.join(CACHE_PATH, `${model}/${hwVersion}/${file}`);
}

async function updateCache() {
  logger.info('Fetching firmware update...');
  const fetchPath = await fetch(REPO, { temp: CACHE_PATH });
  await extract(fetchPath, CACHE_PATH, {
    extract: {
      filter: path => !path.includes('.gitignore'),
    },
  });
  rimraf.sync(path.join(CACHE_PATH, 'bitbucket'));
}
