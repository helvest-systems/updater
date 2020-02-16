import path from 'path';
import fs from 'fs';
import { app, ipcMain } from 'electron';
import isOnline from 'is-online';
import { fetch, extract } from 'gitly';
import rimraf from 'rimraf';
import * as window from './window';

type UpdateData = Omit<DeviceData, 'fwVersion'> & {
  version: string;
  file: string;
  checksum: string;
};

const REPO = 'bitbucket:AWEL-GmbH/updates';
const CACHE = path.join(app.getPath('userData'), 'Updates Cache');

let update: UpdateData | null = null;

export async function checkFirmwareUpdates({ model, hwVersion, fwVersion }: DeviceData) {
  const online = await isOnline();
  if (!online) {
    const mainWindow = window.getWindow();
    mainWindow?.webContents.send('app/is-offline');
  } else await updateCache();

  const updatePath = path.join(CACHE, `${model}/${hwVersion}`);
  const manifest = fs.readFileSync(`${updatePath}/manifest.json`);
  const data = JSON.parse(manifest.toString());

  if (data.sources[0].version == fwVersion) return false;

  update = { model, hwVersion, ...data.sources[0] };
  return true;
}

export function getUpdateVersion() {
  return update?.version;
}

export function getFilePath() {
  const { model, hwVersion, file } = update!;
  return path.join(CACHE, `${model}/${hwVersion}/${file}`);
}

async function updateCache() {
  const fetchPath = await fetch(REPO, { temp: CACHE });
  await extract(fetchPath, CACHE, {
    extract: {
      filter: path => !path.includes('.gitignore'),
    },
  });
  rimraf.sync(path.join(CACHE, 'bitbucket'));
}
