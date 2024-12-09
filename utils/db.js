import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    this.uri = `mongodb://${host}:${port}`;
    this.dbName = database;
    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.db = null;
  }

  // Method to check if the connection to MongoDB is successful
  async isAlive() {
    try {
      if (!this.db) {
        await this.client.connect();
        this.db = this.client.db(this.dbName);
      }
      return true;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return false;
    }
  }

  // Method to get the number of documents in the 'users' collection
  async nbUsers() {
    try {
      if (!this.db) await this.isAlive();
      const usersCollection = this.db.collection('users');
      const count = await usersCollection.countDocuments();
      return count;
    } catch (error) {
      console.error('Error getting the number of users:', error);
      return 0;
    }
  }

  // Method to get the number of documents in the 'files' collection
  async nbFiles() {
    try {
      if (!this.db) await this.isAlive();
      const filesCollection = this.db.collection('files');
      const count = await filesCollection.countDocuments();
      return count;
    } catch (error) {
      console.error('Error getting the number of files:', error);
      return 0;
    }
  }
}

// Create and export the instance of DBClient
const dbClient = new DBClient();
export default dbClient;
