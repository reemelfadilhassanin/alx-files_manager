import redisClient from '../utils/redis.js';  // Import the Redis client
import dbClient from '../utils/db.js';  // Import the DB client to interact with MongoDB

class UsersController {
  // GET /users/me: Retrieve the user information based on the token
  static async getMe(req, res) {
    const token = req.get('X-Token');  // Get the token from the header

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the user ID from Redis
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Retrieve the user from the database
    const user = await dbClient.db.collection('users').findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Return the user object with only the id and email
    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;
