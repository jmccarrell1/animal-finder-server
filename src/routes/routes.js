const router = require('express').Router();
const animalDbContext = require('../data/animalDbContext');
const logger = require('../components/logger');

router.use(function timeLog(req, res, next) {
  logger.info(`Time ${Date.now()}`);
  next();
});

router.use(require('./dog/getDogs')(animalDbContext, logger));
//router.use(require('./application/saveApplications')(dbConnection, logger));

module.exports = router;
