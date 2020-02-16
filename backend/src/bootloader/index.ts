import debug from 'debug';
import intelHex from 'node-intelhex';
import SerialPort from 'serialport';
import Connection from './connection';
import {
  AUTOBAUD_BUFFER,
  COMMANDS,
  DEFAULT_PORT_OPTIONS,
  MAX_DATA_LEN,
  SUCCESS_RESPONSE,
} from './constants';
import { timify } from './utils';

const d = debug('updater:client');

class Client {
  private connection?: Connection;
  public onFlashing?: (progress: number) => void;

  public async connect() {
    const ports = await this.getAvailablePorts();
    ports.forEach(port => d('Found port: %s', port.path));
    const candidates = await Promise.all(ports.map(port => this.listen(port)));
    const connections = candidates.filter(Boolean);

    // For now we handle just a single connection
    this.connection = connections[0] as Connection;

    if (connections.length === 0) {
      return Promise.reject('Unable to connect');
    }

    return this.getDeviceData();
  }

  public async getDeviceData(): Promise<DeviceData> {
    const hwData = await this.send(COMMANDS.READ_VERSION_BOOTLOADER);
    const fwData = await this.send(COMMANDS.READ_VERSION_FIRMWARE);
    const hwVersion = hwData
      .slice(0, 2)
      .reverse()
      .join('.');
    const model = `HP${hwData[2]}00`;
    const fwVersion = fwData.reverse().join('.');

    return {
      model,
      hwVersion,
      fwVersion,
    };
  }

  public async setFlashAddress(addr: number) {
    const data = [(addr >> 24) & 0xff, (addr >> 16) & 0xff, (addr >> 8) & 0xff, (addr >> 0) & 0xff];

    return this.send(COMMANDS.SET_ADDRESS, data);
  }

  public async flash(filename: string) {
    const { address, data } = await intelHex.readFile(filename);
    const size = data.length;

    await this.setFlashAddress(address);

    let chunkCursor = 0,
      dataCursor = 0;
    let chunk = [];

    while (dataCursor < size) {
      chunk[chunkCursor++] = data[dataCursor++];

      if (chunkCursor === MAX_DATA_LEN) {
        await this.send(COMMANDS.FLASH_WRITE_DATA, chunk);
        chunk = [];
        chunkCursor = 0;
      }

      if (this.onFlashing) {
        const progress = Math.round((dataCursor / size) * 100);
        this.onFlashing(progress);
      }
    }

    await this.send(COMMANDS.FLASH_WRITE_DATA, chunk); // send remaining data

    // We have to send another packet in order to fill last flash page
    // TODO: what does this mean? Ask it to Rod
    await this.send(COMMANDS.FLASH_WRITE_DATA);
  }

  private async getAvailablePorts() {
    const infos = await SerialPort.list();
    return infos.map(portInfo => new SerialPort(portInfo.path, DEFAULT_PORT_OPTIONS));
  }

  private async listen(port: SerialPort) {
    const timedPromise = timify(
      new Promise(resolve => {
        port.open(err => {
          if (err) {
            return;
          }

          port.once('data', (data: Buffer) => {
            data = data.slice(1, -1);
            data.equals(SUCCESS_RESPONSE) && resolve(port);
          });
          port.write(AUTOBAUD_BUFFER);
        });
      }),
      1000,
    );

    try {
      const port = (await timedPromise()) as SerialPort;
      return new Connection(port);
    } catch {
      return false;
    }
  }

  private send(command: number, data?: number[]) {
    if (this.connection == null) {
      throw new TypeError('Connection#send called on a null object.');
    }

    return this.connection.send(command, data || []);
  }
}

export default Client;
export { default as MockClient } from './mock';
