// Import MongoClient from mongodb
import { MongoClient } from 'mongodb';

// Class DBClient
class DBClient {
    constructor() {
        // Get the environment variables or use defaults
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        // Construct the connection string
        this.uri = `mongodb://${host}:${port}`;
        this.client = new MongoClient(this.uri);
        this.db = this.client.db(database);
    }

    // Check if the MongoDB connection is alive
    isAlive() {
        try {
            // Try to connect to the database
            this.client.db().command({ ping: 1 });
            return true; // Connection is alive
        } catch (error) {
            return false; // Connection failed
        }
    }

    // Get the number of users in the users collection
    async nbUsers() {
        try {
            const usersCollection = this.db.collection('users');
            const count = await usersCollection.countDocuments();
            return count;
        } catch (error) {
            console.error('Error fetching users count:', error);
            return 0; // Return 0 if error occurs
        }
    }

    // Get the number of files in the files collection
    async nbFiles() {
        try {
            const filesCollection = this.db.collection('files');
            const count = await filesCollection.countDocuments();
            return count;
        } catch (error) {
            console.error('Error fetching files count:', error);
            return 0; // Return 0 if error occurs
        }
    }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
