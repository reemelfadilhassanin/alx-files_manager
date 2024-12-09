// routes/index.js
import express from 'express';
import { getStatus, getStats } from '../controllers/AppController.js';

const router = express.Router();

// Define the API routes and map to controller methods
router.get('/status', getStatus);
router.get('/stats', getStats);

export default router;
