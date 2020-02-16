/// <reference types="node" />

// Auxliary Types and Interfaces
interface WriteOptions {
  progress?: (value: number) => void;
}

interface ReadOptions extends WriteOptions {
  info?: (msg: string) => void;
}

interface BufferReader {
  getNextRecord: () => string;
  eof: () => boolean;
  length: () => number;
  bytesRead: () => number;
}

type WriteCallback = (err?: Error) => void;
type ReadCallback = (err?: Error, result?: Result) => void;

// Exports
export interface Result {
  address: number;
  data: Buffer;
}

export function setLineBytes(mlb: number): void;

export function writeFile(
  filename: string,
  address: number,
  data: Buffer,
  options?: WriteOptions,
  callback?: WriteCallback,
): Promise<void>;

export function readFile(
  filename: string,
  options?: ReadOptions,
  callback?: ReadCallback,
): Promise<Result>;

export function bufferReader(address: number, data: Buffer): BufferReader;
