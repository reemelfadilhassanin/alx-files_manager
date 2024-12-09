// controllers/UsersController.js
import crypto from 'crypto';
import dbClient from '../utils/db';

const UsersController = {

  // POST /users - Create a new user
  async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in the DB
    try {
      const existingUser = await dbClient.db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // Hash the password with SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Save the new user in the database
    try {
      const result = await dbClient.db.collection('users').insertOne({ email, password: hashedPassword });
      const newUser = result.ops[0];

      // Respond with the created user details
      return res.status(201).json({ id: newUser._id.toString(), email: newUser.email });

    } catch (err) {
      return res.status(500).json({ error: 'Failed to create user' });
    }
  }

};

export default UsersController;

