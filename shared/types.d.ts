/// <reference path="../backend/node_modules/electron/electron.d.ts" />

type BackendEvent =
  // Connection events
  | 'connection/start'
  | 'connection/connected'
  | 'connection/failed'

  // Update events
  | 'update/check'
  | 'update/available'
  | 'update/unavailable'
  | 'update/install'
  | 'update/installing'
  | 'update/installed'
  | 'update/failed'

  // Others
  | 'app/quit'
  | 'app/is-offline';

type BackendListener = (...args: any[]) => void;

type DeviceData = {
  hwVersion: string;
  fwVersion: string;
  model: string;
};

interface Window {
  emitBackendEvent: (event: BackendEvent) => void;
  addBackendListener: (event: BackendEvent, listener: BackendListener) => void;
}
