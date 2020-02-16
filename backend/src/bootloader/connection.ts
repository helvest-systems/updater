import SerialPort from 'serialport';
import ConnectionError from './connection-error';
import { CRC_SETTINGS, FRAME_CHARS } from './constants';
import FrameParser from './frame-parser';

class Connection {
  private txChannel: SerialPort;
  private rxChannel: FrameParser;

  constructor(serialPort: SerialPort) {
    this.txChannel = serialPort;
    this.rxChannel = serialPort.pipe(new FrameParser());
  }

  public send(cmd: number, data: number[] = []) {
    const requestPacket = this.createPacket(cmd, data);
    if (!this.txChannel.write(requestPacket)) {
      this.txChannel.drain();
    }

    return new Promise<number[]>((resolve, reject) => {
      this.rxChannel.once('readable', () => {
        const responsePacket = Array.from<number>(this.rxChannel.read());

        try {
          const data = this.parsePacket(responsePacket, cmd);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  private createPacket(cmd: number, data: number[]) {
    const crc = this.computeCrc([cmd, ...data]);
    const crcValues = [(crc >> 8) & 0xff, crc & 0xff]; // [CRC_MSB, CRC_LSB]

    return [
      FRAME_CHARS.STX,
      ...this.normalizePacket([cmd, ...data, ...crcValues]),
      FRAME_CHARS.ETX,
    ];
  }

  private parsePacket(packet: number[], cmdSent: number) {
    packet = this.removeEscape(packet);
    const actualCrc = packet.pop()! + packet.pop()! * 256; // CRC_LSB + CRC_MSB
    const expectedCrc = this.computeCrc(packet);

    if (actualCrc !== expectedCrc) {
      throw new ConnectionError(cmdSent, 'Invalid packet received: wrong CRC.');
    }

    if (packet.shift()! - 0x80 !== cmdSent) {
      throw new ConnectionError(
        cmdSent,
        'Invalid packet received: command error.',
      );
    }

    return packet;
  }

  private computeCrc(data: number[]) {
    let crc = CRC_SETTINGS.initialValue;

    for (const byte of data) {
      for (let i = 0; i < 8; i++) {
        const bit = ((byte >> (7 - i)) & 1) == 1;
        const c15 = ((crc >> 15) & 1) == 1;
        crc <<= 1;
        if (c15 !== bit) {
          crc ^= CRC_SETTINGS.polynomial;
        }
      }
    }

    return crc & 0xffff;
  }

  private normalizePacket(packet: number[]) {
    return packet.reduce<number[]>((acc, byte) => {
      if (Object.values(FRAME_CHARS).includes(byte)) {
        return acc.concat([FRAME_CHARS.ESC, byte | 0x80]);
      }

      return acc.concat(byte);
    }, []);
  }

  private removeEscape(packet: number[]) {
    let offset = 0x00;
    return packet.reduce<number[]>((acc, byte) => {
      if (byte === FRAME_CHARS.ESC) {
        offset = 0x80;
        return acc;
      }

      acc.push(byte - offset);
      offset = 0x00;
      return acc;
    }, []);
  }
}

export default Connection;
