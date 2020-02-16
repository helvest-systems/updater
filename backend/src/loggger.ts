import path from 'path';
import winston from 'winston';
import { LOG_PATH } from './constants';

const consoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.prettyPrint({ colorize: true }),
);

const MAX_LOG_SIZE = 1000 * 10; // Size must be specified in bytes, so we have 1000B = 1MB
const MAX_LOG_FILES = 5;

const transports = [
  new winston.transports.File({
    filename: path.join(LOG_PATH, 'combined.log'),
    maxsize: MAX_LOG_SIZE,
    maxFiles: MAX_LOG_FILES,
    tailable: true,
  }),
  new winston.transports.File({
    level: 'error',
    filename: path.join(LOG_PATH, 'error.log'),
    maxsize: MAX_LOG_SIZE,
    maxFiles: MAX_LOG_FILES,
    tailable: true,
  }),
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(consoleFormat, winston.format.uncolorize()),
  transports,
});

export default logger;
