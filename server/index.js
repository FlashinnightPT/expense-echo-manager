
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createPool } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
let pool;
try {
  pool = createPool();
  console.log('Database connection pool created');
} catch (error) {
  console.error('Failed to create database connection pool:', error);
  process.exit(1);
}

// Routes
app.use('/api/categories', require('./routes/categories')(pool));
app.use('/api/transactions', require('./routes/transactions')(pool));
app.use('/api/users', require('./routes/users')(pool));
app.use('/api/db-test', require('./routes/db-test')(pool));

// Test endpoint
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
