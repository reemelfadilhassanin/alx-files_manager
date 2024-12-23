import express from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';
import FilesController from '../controllers/FilesController.js';

const router = express.Router();

// Existing routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// Authentication routes
router.get('/connect', AuthController.getConnect);  // Sign in and generate a token
router.get('/disconnect', AuthController.getDisconnect);  // Sign out and delete token
router.get('/users/me', UsersController.getMe);  // Retrieve user information based on token

// File routes
router.get('/files/:id', FilesController.getShow);  // Get a specific file by ID
router.get('/files', FilesController.getIndex);  // List all files, with optional pagination

export default router;
