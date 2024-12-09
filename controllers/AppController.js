// controllers/AppController.js
import { createClient } from 'redis';  // Redis client
// eslint-disable-next-line import/extensions
import dbClient from '../utils/db.js';  // DB client to check MongoDB status

// Create Redis client instance
const redisClient = createClient({ url: 'redis://localhost:6379' });

// Check if Redis is alive
const checkRedis = async () => {
    try {
        await redisClient.connect();
        return true;
    } catch (error) {
        console.error('Redis connection error:', error);
        return false;
    }
};

// GET /status => Check if Redis and DB are alive
export const getStatus = async (req, res) => {
    try {
        const redisStatus = await checkRedis();
        const dbStatus = await dbClient.isAlive();
        res.status(200).json({ redis: redisStatus, db: dbStatus });
    } catch (error) {
        console.error('Error checking status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// GET /stats => Get number of users and files in DB
export const getStats = async (req, res) => {
    try {
        const usersCount = await dbClient.nbUsers();
        const filesCount = await dbClient.nbFiles();
        res.status(200).json({ users: usersCount, files: filesCount });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
