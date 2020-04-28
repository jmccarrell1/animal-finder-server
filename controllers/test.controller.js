const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('the test controller');
});

router.get('/:id', (req, res) => {
  res.send('the test id controller');
});

module.exports = router;
