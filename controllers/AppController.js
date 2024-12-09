import redisClient from '../utils/redis.js';  // Import Redis client
import dbClient from '../utils/db.js';  // Import MongoDB client

class AppController {
  // GET /status: Check if Redis and DB are alive
  static async getStatus(req, res) {
    // Check if Redis and DB are alive
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();

    // Return the status in the response
    return res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  // GET /stats: Get the number of users and files in the DB
  static async getStats(req, res) {
    try {
      // Get the number of users and files from the DB
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();

      // Return the counts in the response
      return res.status(200).json({ users: usersCount, files: filesCount });
    } catch (err) {
      // If an error occurs, return a 500 status with the error message
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;
