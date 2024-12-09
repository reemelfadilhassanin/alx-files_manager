import express from 'express';
import routes from './routes/index.js';  // Import routes from routes/index.js

// Set up the Express app
const app = express();

// Set up the server to listen on PORT or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Load all the routes from routes/index.js
app.use('/api', routes);  // Prefix all routes with /api
