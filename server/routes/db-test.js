
module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { testConnection } = require('../db');
  
  router.post('/', async (req, res) => {
    try {
      const isConnected = await testConnection(pool);
      res.json({ success: isConnected });
    } catch (error) {
      console.error('Error testing database connection:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });
  
  return router;
};
