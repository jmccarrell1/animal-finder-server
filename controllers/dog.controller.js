const express = require('express');
const router = express.Router();
const axios = require('axios');
const cache = require('../cache');
const queryBuilder = require('../modules/query-builder');

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
          return 'Invalid request';
        });
    })
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send('Invalid request');
    });
});

router.get('/:id', (req, res) => {
  res.send('the dog test id controller');
});

module.exports = router;
