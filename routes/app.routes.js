const router = require('express').Router();
const auth = require('../modules/auth');
const testController = require('../controllers/test.controller');
const dogController = require('../controllers/dog.controller');
const typesController = require('../controllers/types.controller');
const organizationController = require('../controllers/organization.controller');
const breedsController = require('../controllers/breeds.controller');

router.use(function timeLog(req, res, next) {
  console.log(`Time ${Date.now()}`);
  next();
});

router.use('/test', testController);
router.use('/dog', auth, dogController);
router.use('/types', auth, typesController);
router.use('/organization', auth, organizationController);
router.use('/breeds', auth, breedsController);

module.exports = router;
