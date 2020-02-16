import log from 'electron-log';

log.catchErrors({
  showDialog: false,
  onError(error) {
    log.warn(`%cUNHANDLED EXCEPTION: ${error.message}`, 'color: red');
    return false;
  },
});

// Disable unused transports
if (log.transports.ipc) log.transports.ipc.level = false;
log.transports.remote.level = false;

export default log;
