
const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        const { DB_HOST = 'localhost', DB_PORT = 27017, DB_DATABASE = 'files_manager' } = process.env;
        this.uri = `mongodb://${DB_HOST}:${DB_PORT}`;
        this.databaseName = DB_DATABASE;
    }

    async isAlive() {
        try {
            const client = new MongoClient(this.uri);
            await client.connect();
            await client.db(this.databaseName).command({ ping: 1 });
            return true;
        } catch (e) {
            console.error('MongoDB error:', e);
            return false;
        }
    }

    async nbUsers() {
        const client = new MongoClient(this.uri);
        const db = await client.db(this.databaseName);
        const count = await db.collection('users').countDocuments();
        return count;
    }

    async nbFiles() {
        const client = new MongoClient(this.uri);
        const db = await client.db(this.databaseName);
        const count = await db.collection('files').countDocuments();
        return count;
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
