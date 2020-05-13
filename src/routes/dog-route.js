const express = require('express');
const cache = require('../components/cache');
const dbContext = require('../data/dbContext');
const logger = require('../components/logger');

module.exports = function (app) {
  var route = express.Router();

  app.use('/api', route);

  route.get('/dogs', async (req, res) => {
    const cacheKey = '/api/dogs';
    const cacheData = await cache.get(cacheKey);

    if (cacheData) {
      return res.status(200).json(cacheData);
    }

    try {
      await dbContext.Animal.find({})
        .populate('organization')
        .exec((err, result) => {
          if (err) {
            logger.error(err);
            res.status(500).send('error during processing');
          } else {
            cache.set(cacheKey, { animals: result });
            res.json({ animals: result });
          }
        });
    } catch (error) {
      logger.error(error);
      res.status(500).send('error during processing');
    }
  });

  route.get('/dogs/:id', async (req, res) => {
    const cacheKey = `/api/dogs/${req.params.id}`;
    const cacheData = await cache.get(cacheKey);

    if (cacheData) {
      return res.status(200).json(cacheData);
    }

    dbContext.Animal.findById(req.params.id)
      .populate('organization')
      .exec((err, result) => {
        if (err) {
          logger.error(err);
          res.status(500).send('error during processing');
        } else {
          cache.set(cacheKey, result);
          res.json(result);
        }
      });
  });
};
