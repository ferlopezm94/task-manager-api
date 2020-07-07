import mongoose from 'mongoose';

const connectionURL = process.env.MONGODB_CONNECTION_URL || 'mongodb://127.0.0.1:27017';
const databaseName = process.env.MONGODB_DATABASE_NAME || 'task-manager';

mongoose.connect(`${connectionURL}/${databaseName}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
