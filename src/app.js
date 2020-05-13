require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth2');
require('./data/mongoose');
const dogRoute = require('../src/routes/dog-route');

class App {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(auth);

    dogRoute(this.app);
  }
}

module.exports = new App().app;
