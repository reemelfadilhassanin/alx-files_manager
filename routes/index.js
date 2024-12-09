import express from 'express';
import AppController from '../controllers/AppController.js';  // Import AppController
import UsersController from '../controllers/UsersController.js';  // Import UsersController

const router = express.Router();

// Define the existing /status and /stats routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Define the new /users route to create a new user
router.post('/users', UsersController.postNew);  // Add the new route for user creation

export default router;
