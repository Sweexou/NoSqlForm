db = db.getSiblingDB('forms_db');

db.createUser({
  user: 'admin',
  pwd: 'admin123',
  roles: [{ role: 'readWrite', db: 'forms_db' }]
});

db.createCollection('users');
db.createCollection('questionnaires');
db.createCollection('responses');
