require('dotenv').config();
const { notarize } = require('electron-notarize');

module.exports = async function notarizer(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== 'darwin') return;

  if (!(process.env.APPLE_ID && process.env.APPLE_ID_PASSWORD)) {
    console.warn(
      'Skipping macOS app notarization.' +
        ' Missing one or more environment vars (APPLE_ID, APPLE_ID_PASSWORD).',
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'ch.helvest',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
  });
};
