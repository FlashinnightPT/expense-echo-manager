
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createPool } = require('./db');

// Initialize the Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create database connection pool
const pool = createPool();

// Import and setup routes
const transactionRoutes = require('./routes/transactions')(pool);
const categoryRoutes = require('./routes/categories')(pool);
const userRoutes = require('./routes/users')(pool);
const dbTestRoutes = require('./routes/db-test')(pool);
const authRoutes = require('./routes/auth')(pool);

// Use routes
app.use('/transactions', transactionRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/db-test', dbTestRoutes);
app.use('/auth', authRoutes);

// Ping endpoint for connection checks
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Define port
const port = process.env.PORT || 3001;

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
