import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';  // Import UUID for generating tokens
import redisClient from '../utils/redis.js';  // Import the Redis client
import dbClient from '../utils/db.js';  // Import the DB client to interact with MongoDB

class AuthController {
  // GET /connect: Authenticate the user and generate a token
  static async getConnect(req, res) {
    const authHeader = req.get('Authorization');  // Get the Authorization header
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Decode the Base64 encoded email:password
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [email, password] = credentials.split(':');

    // Check if email or password is missing
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Hash the password (SHA1)
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Find the user in the database
    const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate a new token using UUIDv4
    const token = uuidv4();

    // Store the token in Redis with a 24-hour expiration
    redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 86400);  // 86400 seconds = 24 hours

    // Return the token to the user
    return res.status(200).json({ token });
  }

  // GET /disconnect: Sign out the user by deleting the token
  static async getDisconnect(req, res) {
    const token = req.get('X-Token');  // Get the token from the header

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the token exists in Redis
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Delete the token from Redis
    await redisClient.del(`auth_${token}`);

    // Return a successful response
    return res.status(204).send();
  }
}

export default AuthController;
