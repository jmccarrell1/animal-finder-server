const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(
  () => {
    console.log('Database connection established!');
  },
  (err) => {
    console.log('Error connecting Database instance due to: ', err);
  }
);

const connection = mongoose.connection;

connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

module.exports = connection;
