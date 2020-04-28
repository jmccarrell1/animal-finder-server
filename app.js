require('dotenv').config();
const express = require('express');
const routes = require('./routes/app.routes');
const bodyParser = require('body-parser');
//const auth = require('./modules/auth');
//const axios = require('axios');
//const AppCache = require('./cache');

// axios.interceptors.request.use((config) => {
//   console.log(config);
//   config.headers['foo'] = '123abc';
//   return config;
// });

class App {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    //this.app.use(express.urlencoded());
    //this.app.use(auth);
    this.app.use(routes);
    this.app.use((req, res, next) => {
      const error = new Error('Not found');
      error.status = 404;
      next(error);
    });
    this.app.use((error, req, res, next) => {
      res.status(error.status || 500).send({
        error: {
          status: error.status || 500,
          message: error.message || 'Internal Server Error',
        },
      });
    });
    //this.app.use(bodyParser.urlencoded());
    //this.cache = new AppCache();
  }
}

module.exports = new App().app;
