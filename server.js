// server.js
import express from 'express';
// eslint-disable-next-line import/no-unresolved
import dotenv from 'dotenv';
import routes from './routes/index'; // Import routes from index.js in the routes folder

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Use the environment variable PORT or default to 5000

// Middleware to parse JSON request bodies
app.use(express.json());

// Load routes into the application
app.use(routes);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
