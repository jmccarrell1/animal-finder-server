const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../cache');
const queryBuilder = require('../modules/query-builder');
const logger = require('../logger');

router.post('/', (req, res) => {
  const url = queryBuilder.buildBreeds(req.body);

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

module.exports = router;
