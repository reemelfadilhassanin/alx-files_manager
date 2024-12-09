import { MongoClient } from 'mongodb';

// Fetch connection details from environment variables or use defaults
const host = process.env.DB_HOST || 'localhost';  // Database host, default is localhost
const port = process.env.DB_PORT || 27017;  // Database port, default is 27017
const database = process.env.DB_DATABASE || 'files_manager';  // Database name, default is 'files_manager'
const url = `mongodb://${host}:${port}/`;  // Construct MongoDB connection URL

class DBClient {
  constructor() {
    // Initialize the db property to null before establishing the connection
    this.db = null;

    // Connect to MongoDB and handle the result
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      if (error) {
        // Log any connection errors
        console.error('MongoDB connection error:', error);
      } else {
        // On successful connection, assign the database to this.db
        this.db = client.db(database);

        // Create 'users' and 'files' collections if they don't already exist
        this.db.createCollection('users');
        this.db.createCollection('files');
      }
    });
  }

  // Method to check if the connection to the database is alive
  isAlive() {
    // Returns true if the db instance is successfully created, otherwise false
    return !!this.db;
  }

  // Asynchronous method to count the number of documents in the 'users' collection
  async nbUsers() {
    // Returns the count of documents in the 'users' collection
    return this.db.collection('users').countDocuments();
  }

  // Asynchronous method to find a user based on the provided query
  async getUser(query) {
    // Log the incoming query for debugging
    console.log('QUERY IN DB.JS', query);

    // Use the query to find a user in the 'users' collection
    const user = await this.db.collection('users').findOne(query);

    // Log the fetched user for debugging
    console.log('GET USER IN DB.JS', user);

    // Return the found user
    return user;
  }

  // Asynchronous method to count the number of documents in the 'files' collection
  async nbFiles() {
    // Returns the count of documents in the 'files' collection
    return this.db.collection('files').countDocuments();
  }
}

// Create an instance of DBClient and export it
const dbClient = new DBClient();
export default dbClient;
