const express = require('express');
const router = express.Router();
const cache = require('../../components/cache');

function getDogs(dbContext, logger) {
  router.get('/dogs', async (req, res, next) => {
    const cacheKey = '/dogs';

    try {
      const cacheData = await cache.get(cacheKey);

      if (cacheData) {
        res.send(cacheData);
        return;
      }

      dbContext.Animal.find({})
        .populate('organization')
        .exec((err, result) => {
          if (err) {
            res.send(err);
          } else {
            cache.set(cacheKey, result);
            res.send(result);
          }
        });
    } catch (error) {
      logger.error(error);
      next(error);
    }
  });

  return router;
}

module.exports = getDogs;
