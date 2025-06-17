// import { MongoClient } from 'mongodb';
// import { MONGO_URI } from '$env/static/private';

// const client = new MongoClient(MONGO_URI);
// await client.connect();

// export default {
//   users: client.db().collection('users'),
//   questionnaires: client.db().collection('questionnaires'),
//   responses: client.db().collection('responses'),
// };

import { MongoClient } from 'mongodb';
import { MONGO_URI } from '$env/static/private';

const client = new MongoClient(MONGO_URI);
let isConnected = false;

const dbPromise = (async () => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }

  const db = client.db();

  return {
    users: db.collection('users'),
    questionnaires: db.collection('questionnaires'),
    responses: db.collection('responses'),
  };
})();

export default await dbPromise;
