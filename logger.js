const { createLogger, format, transports } = require('winston');
const { timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}: ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(timestamp(), myFormat),
  defaultMeta: { service: 'animal-service' },
  transports: [
    new transports.File({
      filename: 'animal-service.log',
      level: 'info',
      maxsize: '5000000',
      tailable: 'true',
    }),
    new transports.Console({ level: 'debug' }),
  ],
});

module.exports = logger;
