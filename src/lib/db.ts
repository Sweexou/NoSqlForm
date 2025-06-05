import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI!);
await client.connect();

export default {
  users: client.db('myapp').collection('users')
};
