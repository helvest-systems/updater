import { COMMANDS } from './constants';

const cmdNames = Object.keys(COMMANDS);
const cmdValues = Object.values(COMMANDS);

class ConnectionError extends Error {
  constructor(cmd: number, message: string) {
    super(`[${cmdNames[cmdValues.indexOf(cmd)]}]: ${message}`);
  }
}

export default ConnectionError;
