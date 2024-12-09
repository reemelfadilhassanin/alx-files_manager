import express from 'express';
import AppController from '../controllers/AppController.js';  // Import the AppController

const router = express.Router();

// Define the /status endpoint
router.get('/status', AppController.getStatus);

// Define the /stats endpoint
router.get('/stats', AppController.getStats);

export default router;
