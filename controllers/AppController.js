// controllers/AppController.js
import dbClient from '../utils/db'; // Import the database client
import redisClient from '../utils/redis'; // Import the Redis client

const AppController = {

  // GET /status - Check the status of Redis and DB
  async getStatus(req, res) {
    try {
      // Check if Redis is connected
      const redisStatus = redisClient.isAlive(); // Assuming this is a method on your redis client

      // Check if DB is connected
      await dbClient.connect(); // Assuming the connect method checks if DB is alive
      const dbStatus = true;

      // Return the status response
      return res.status(200).json({ redis: redisStatus, db: dbStatus });

    } catch (err) {
      // If any of the connections fail
      return res.status(500).json({ error: 'Error checking status' });
    }
  },

  // GET /stats - Get the number of users and files in DB
  async getStats(req, res) {
    try {
      // Get the number of users from the database
      const usersCount = await dbClient.db.collection('users').countDocuments();

      // Get the number of files from the database
      const filesCount = await dbClient.db.collection('files').countDocuments();

      // Return the statistics
      return res.status(200).json({ users: usersCount, files: filesCount });

    } catch (err) {
      // Handle errors during counting
      return res.status(500).json({ error: 'Error fetching stats' });
    }
  }
};

export default AppController;
