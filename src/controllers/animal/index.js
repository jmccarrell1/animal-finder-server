const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../../components/cache');
const queryBuilder = require('../query-builder');
const logger = require('../../components/cache');

router.post('/', (req, res) => {
  const url = queryBuilder.buildAnimal(req.body);

  cache
    .get(url.href, () => {
      return axios
        .get(url.href, req.body)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          logger.info(`get exception from ${url.href}: error: ${error}`);
          return 'Invalid request';
        });
    })
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      logger.info(`cache get exception from ${url.href}: error: ${error}`);
      res.send('Invalid request');
    });
});

router.get('/:id', (req, res) => {
  res.send('the animal test id controller');
});

module.exports = router;
