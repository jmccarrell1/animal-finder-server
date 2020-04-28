require('dotenv').config();
const express = require('express');
const routes = require('./routes/app.routes');
const logger = require('./logger');

class App {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    //this.app.use(express.urlencoded());
    this.app.use(routes);
    this.app.use((req, res, next) => {
      const error = new Error('Not found');
      error.status = 404;
      next(error);
    });
    this.app.use((error, req, res, next) => {
      logger.error(`Unhandled exception bubbled up: ${error}`);
      res.status(error.status || 500).send({
        error: {
          status: error.status || 500,
          message: error.message || 'Internal Server Error',
        },
      });
    });
  }
}

module.exports = new App().app;
