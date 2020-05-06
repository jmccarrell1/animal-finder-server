const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../../components/cache');
const queryBuilder = require('../query-builder');

function saveApplication(db, logger) {
  router.post('/applications', async (req, res, next) => {
    try {
      res.send(200);
    } catch (error) {
      logger.error(`post exception: ${error} body: ${req.body}`);
      next(error);
    }
  });

  return router;
}

module.exports = saveApplication;
