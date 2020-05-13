const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

const mongod = new MongoMemoryServer();

module.exports.connect = async () => {
  const mongooseOpts = {
    useNewUrlParser: true,
  };

  process.env.MONGODB_URI = await mongod.getConnectionString();

  await mongoose.connect(process.env.MONGODB_URI, mongooseOpts);

  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e);
      mongoose.connect(process.env.MONGODB_URI, mongooseOpts);
    }
    console.log(e);
  });

  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${process.env.MONGODB_URI}`);
  });
};

module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
