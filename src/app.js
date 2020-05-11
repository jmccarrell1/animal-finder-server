require('dotenv').config();
const express = require('express');
const logger = require('./components/logger');
const routes = require('./routes/routes');
const auth = require('./middleware/auth2');

// pattern in use (some of) https://medium.com/@carlos.illobre/nodejs-express-how-to-organize-your-routes-in-very-big-applications-and-why-controllers-are-evil-e202eea497f4

class App {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(auth);
    this.app.use('/api', routes);
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
