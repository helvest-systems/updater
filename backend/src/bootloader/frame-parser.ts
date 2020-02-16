import { Transform, TransformCallback } from 'stream';
import { FRAME_CHARS } from './constants';

class FrameParser extends Transform {
  private incompletedFrame: number[];

  constructor() {
    super();
    this.incompletedFrame = [];
  }

  public _transform(
    chunk: any,
    _encoding: string,
    callback: TransformCallback,
  ) {
    if (typeof chunk === 'string') {
      chunk = Buffer.from(chunk);
    }

    const stxIndex = chunk.indexOf(FRAME_CHARS.STX);
    const etxIndex = chunk.indexOf(FRAME_CHARS.ETX);

    if (
      this.incompletedFrame.length !== 0 &&
      -1 < etxIndex &&
      etxIndex < stxIndex
    ) {
      const frame = [...this.incompletedFrame, ...chunk.slice(0, etxIndex)];
      this.push(frame);
    }

    let frame = [];
    for (let i = stxIndex + 1; i < chunk.length; i++) {
      if (chunk[i] === FRAME_CHARS.ETX) {
        if (this.incompletedFrame.length > 0) {
          frame = [...this.incompletedFrame, ...frame];
          this.incompletedFrame = [];
        }

        this.push(Buffer.from(frame));
        frame = [];
      } else if (chunk[i] !== FRAME_CHARS.STX) {
        frame.push(chunk[i]);
      }
    }

    if (chunk[chunk.length - 1] !== FRAME_CHARS.ETX) {
      this.incompletedFrame = [...this.incompletedFrame, ...frame];
    }

    callback();
  }
}

export default FrameParser;
