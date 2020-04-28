const express = require('express');
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log(`Time ${Date.now()}`);
  next();
});

router.get('/', function (req, res) {
  res.send('test route');
});

router.get('/test1', function (req, res) {
  res.send('test route 1');
});

router.get('/test2', function (req, res) {
  res.send('test route 2');
});

module.exports = router;
