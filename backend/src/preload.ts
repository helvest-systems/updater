import { ipcRenderer } from 'electron';

window.emitBackendEvent = (event: BackendEvent) => {
  ipcRenderer.send(event);
};

window.addBackendListener = (
  event: BackendEvent,
  listener: BackendListener,
) => {
  ipcRenderer.on(event, (_, args) => listener(args));
};
