//const { transports } = require('winston');

const logger = (module.exports = require('winston'));

logger.format(
  logger.format.combine(
    logger.format.timestamp(),
    logger.format.printf(({ level, message, timestamp }) => {
      return `${timestamp}: ${level}: ${message}`;
    })
  )
);

logger.add(
  new logger.transports.File({
    filename: 'animal-service.log',
    level: 'info',
    maxsize: '104857600',
    maxFiles: 5,
    tailable: 'true',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    json: false,
  })
);

logger.add(
  new logger.transports.Console({
    name: 'debug-console',
    level: 'info',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    stderrLevels: ['error'],
    exitOnErro: true,
  })
);

// logger.add(logger.transports.File, {
//   name: 'debug-file',
//   filename: 'animal-service.log',
//   level: 'debug',
//   handleExceptions: true,
//   humanReadableUnhandledException: true,
//   exitOnError: true,
//   json: false,
//   maxsize: 104857600,
//   maxFiles: 5,
// });
// logger.add(logger.transports.Console, {
//   name: 'debug-console',
//   level: 'debug',
//   handleExceptions: true,
//   humanReadableUnhandledException: true,
//   exitOnError: true,
// });

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(timestamp(), myFormat),
//   defaultMeta: { service: 'animal-service' },
//   transports: [
//     new transports.Console({ level: 'debug', stderrLevels: ['error'] }),
//     new transports.File({
//       filename: 'animal-service.log',
//       level: 'info',
//       maxsize: '5000000',
//       tailable: 'true',
//     }),
//   ],
// });

// module.exports = logger;
