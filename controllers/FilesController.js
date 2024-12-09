import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';  // UUID for generating unique file identifiers
import redisClient from '../utils/redis.js';  // Redis client for user authentication
import dbClient from '../utils/db.js';  // MongoDB client
import fs from 'fs';
import path from 'path';

// Get the folder path for file storage, fallback to /tmp/files_manager if not set
const FILES_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  // POST /files: Upload a file or create a folder
  static async postUpload(req, res) {
    const { name, type, data, parentId, isPublic } = req.body;
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

    // Validate input parameters
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing or invalid type' });
    }
    if (type !== 'folder' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // Validate parentId if provided
    if (parentId) {
      const parentFile = await dbClient.db.collection('files').findOne({ _id: parentId });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    // Default values for parentId and isPublic
    const parent = parentId || 0;
    const publicStatus = isPublic || false;

    // Handle file storage if type is not folder
    if (type !== 'folder') {
      // Generate a unique filename using UUID
      const fileId = uuidv4();
      const fileDir = path.join(FILES_PATH, fileId);

      // Ensure the file directory exists
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      // Write the base64 encoded file data to disk
      const fileBuffer = Buffer.from(data, 'base64');
      const filePath = path.join(fileDir, name);
      fs.writeFileSync(filePath, fileBuffer);

      // Store the file details in the database
      const newFile = {
        userId,
        name,
        type,
        isPublic: publicStatus,
        parentId: parent,
        localPath: filePath,  // Store the local file path
      };

      const result = await dbClient.db.collection('files').insertOne(newFile);
      return res.status(201).json({
        id: result.insertedId.toString(),
        userId,
        name,
        type,
        isPublic: publicStatus,
        parentId: parent,
      });
    }

    // Handle folder creation if type is folder
    const newFolder = {
      userId,
      name,
      type,
      parentId: parent,
      isPublic: publicStatus,
    };

    // Insert folder document into database
    const result = await dbClient.db.collection('files').insertOne(newFolder);
    return res.status(201).json({
      id: result.insertedId.toString(),
      userId,
      name,
      type,
      isPublic: publicStatus,
      parentId: parent,
    });
  }
}

export default FilesController;
