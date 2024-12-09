import pkg from 'mongodb';
const { MongoClient } = pkg;

class DBClient {
    constructor() {
        this.host = process.env.DB_HOST || 'localhost';
        this.port = process.env.DB_PORT || 27017;
        this.database = process.env.DB_DATABASE || 'files_manager';
        this.uri = `mongodb://${this.host}:${this.port}`;
        this.client = new MongoClient(this.uri);
        this.db = null;
    }

    async connect() {
        try {
            // Connect to MongoDB server
            await this.client.connect();
            // Set the database once connected
            this.db = this.client.db(this.database);
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB', error);
            throw error; // Propagate the error if connection fails
        }
    }

    isAlive() {
        return this.db !== null; // Check if the db is connected and available
    }

    async nbUsers() {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        const usersCollection = this.db.collection('users');
        return await usersCollection.countDocuments();
    }

    async nbFiles() {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        const filesCollection = this.db.collection('files');
        return await filesCollection.countDocuments();
    }
}

// Create and export a singleton instance of DBClient
const dbClient = new DBClient();
export default dbClient;
