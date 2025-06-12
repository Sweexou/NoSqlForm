import { MongoClient } from 'mongodb';
import { MONGO_URI } from '$env/static/private';

const client = new MongoClient(MONGO_URI);
await client.connect();

export default {
  users: client.db().collection('users'),
  questionnaires: client.db().collection('questionnaires'),
  responses: client.db().collection('responses'),
};
