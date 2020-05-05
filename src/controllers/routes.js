const router = require('express').Router();
const dbConnection = require('../components/db');
const logger = require('../components/logger');

router.use(function timeLog(req, res, next) {
  console.log(`Time ${Date.now()}`);
  next();
});

router.use(require('./dog/getDogs')(dbConnection, logger));
router.use(require('./type/getTypes')(dbConnection, logger));
router.use(require('./organization/getOrganizations')(dbConnection, logger));
router.use(require('./breed/getBreeds')(dbConnection, logger));
router.use(require('./application/saveApplications')(dbConnection, logger));

module.exports = router;
