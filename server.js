const app = require('./app');
const logger = require('./logger');

let port = 3000;

app.listen(port, () => {
  logger.info(`Server hooked up on port ${port}`);
});
