const app = require('./app');

let port = 3000;

app.listen(3000, () => {
  console.log(`Server hooked up on port ${port}`);
});
