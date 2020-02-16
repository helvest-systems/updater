import { OpenOptions } from 'serialport';

// Connection Initialization
export const AUTOBAUD_BUFFER = Buffer.alloc(16, 'U');
export const SUCCESS_RESPONSE = Buffer.from('c45b3');

// Packet Format
export const MAX_DATA_LEN = 64;
export const FRAME_CHARS = {
  STX: 0x02,
  ETX: 0x03,
  ESC: 0x1b,
};

export const DEFAULT_PORT_OPTIONS: OpenOptions = {
  baudRate: 57600,
  autoOpen: false,
};

export const CRC_SETTINGS = {
  initialValue: 0xffff,
  polynomial: 0x1021,
};

export const COMMANDS = {
  READ_VERSION_BOOTLOADER: 0x11,
  READ_VERSION_FIRMWARE: 0x12,
  READ_VERSION_EEPROM: 0x13,
  START_APPLICATION: 0x18,
  SET_ADDRESS: 0x21,
  FLASH_WRITE_DATA: 0x22,
  FLASH_READ_DATA: 0x23,
  EEPROM_WRITE_DATA: 0x24,
  EEPROM_READ_DATA: 0x25,
};
