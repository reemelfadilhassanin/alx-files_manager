// utils/db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.DB_URI, { useUnifiedTopology: true });
let db;

const connect = async () => {
  if (!db) {
    await client.connect();
    db = client.db(process.env.DB_NAME);
  }
  return db;
};

export default { connect, db: db };
