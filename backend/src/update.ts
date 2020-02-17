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

type UpdateData = {
  file: string;
  version: string;
  checksum: string;
};

export type UpdateInfo = Partial<UpdateData> & {
  available: boolean;
  cached?: boolean | null;
};

const REPO = 'bitbucket:AWEL-GmbH/updates';

let updateInfo: UpdateInfo;

export async function checkFirmwareUpdates({
  model,
  hwVersion,
  fwVersion,
}: DeviceData): Promise<UpdateInfo> {
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
    return { available: false, cached: null };
  }

  const content = fs.readFileSync(manifestJson);
  const updates: [UpdateData] = JSON.parse(content.toString());

  if (updates[0].version == fwVersion) {
    logger.info('Update unavailable');
    return { available: false, cached: !online };
  } else {
    const file = path.join(CACHE_PATH, `${model}/${hwVersion}/${updates[0].file}`);
    updateInfo = { available: true, cached: !online, ...updates[0], file };
    logger.info('Update available', updateInfo);
    return updateInfo;
  }
}

export function getUpdateVersion() {
  return updateInfo?.version;
}

export function getFilePath() {
  return updateInfo.file;
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
