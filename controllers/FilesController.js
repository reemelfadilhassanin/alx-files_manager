import { ObjectId } from 'mongodb';  // To handle ObjectId for MongoDB
import redisClient from '../utils/redis.js';  // Redis client for user authentication
import dbClient from '../utils/db.js';  // MongoDB client

class FilesController {
  // GET /files/:id - Retrieve a specific file by ID
  static async getShow(req, res) {
    const fileId = req.params.id;  // Get the file ID from the URL parameter
    const token = req.get('X-Token');  // Get the token from the header

    // Check if the token is valid
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Retrieve the user based on the token
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the file in the database by ID and userId
    const file = await dbClient.db.collection('files').findOne({
      _id: ObjectId(fileId),
      userId: ObjectId(userId),
    });

    // If the file is not found, return a 404 error
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Return the file document
    return res.status(200).json(file);
  }

  // GET /files - List all files for a specific parentId with pagination
  static async getIndex(req, res) {
    const token = req.get('X-Token');  // Get the token from the header

    // Check if the token is valid
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Retrieve the user based on the token
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the parentId and page query parameters
    const parentId = req.query.parentId ? req.query.parentId : 0;  // Default to root (0) if not provided
    const page = parseInt(req.query.page) || 0;  // Default to the first page (0)

    // Set the limit for pagination
    const limit = 20;
    const skip = page * limit;

    // Aggregate query to fetch files by parentId, paginated
    const files = await dbClient.db.collection('files').aggregate([
      { $match: { userId: ObjectId(userId), parentId: parentId } },
      { $skip: skip },
      { $limit: limit },
    ]).toArray();

    // Return the list of files
    return res.status(200).json(files);
  }
}

export default FilesController;
