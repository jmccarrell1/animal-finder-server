const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../../components/cache');
const queryBuilder = require('../query-builder');

function getTypes(db, logger) {
  router.post('/types', async (req, res, next) => {
    try {
      const url = queryBuilder.buildTypes(req.body);

      const cacheData = await cache.get(url.href);

      if (cacheData) {
        res.send(cacheData);
        return;
      }

      const response = await axios.get(url.href, req.body);

      if (response) {
        cache.set(url.href, response.data);
        res.send(response.data);
      }
    } catch (error) {
      logger.info(`post exception: ${error} body: ${req.body}`);
      next(error);
    }
  });

  return router;
}

module.exports = getTypes;
