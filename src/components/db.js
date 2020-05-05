const mongoose = require('mongoose');

let dev_db_url =
  'mongodb+srv://jeremy:dilbert@cluster0-ziqqz.mongodb.net/test?retryWrites=true&w=majority';

const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB).then(
  () => {
    console.log('Database connection established!');
  },
  (err) => {
    console.log('Error connecting Database instance due to: ', err);
  }
);
mongoose.Promise = global.Promise;

const connection = mongoose.connection;
connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
);

module.exports = connection;
