import crypto from 'crypto';  // To hash the password using SHA1
import dbClient from '../utils/db.js';  // Import the DB client to interact with MongoDB

class UsersController {
  // POST /users: Create a new user
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check if password is provided
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in the database
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Create the new user object
    const newUser = {
      email,
      password: hashedPassword,
    };

    try {
      // Save the new user to the 'users' collection
      const result = await dbClient.db.collection('users').insertOne(newUser);

      // Return the newly created user with only email and id
      const userToReturn = {
        id: result.insertedId,
        email: result.ops[0].email,
      };

      return res.status(201).json(userToReturn);  // Return the user with 201 status
    } catch (err) {
      // If there is an error, send a 500 Internal Server Error
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
