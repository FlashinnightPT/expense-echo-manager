
module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { executeQuery } = require('../db');
  
  // Login route
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }
      
      // Find user by username
      const [user] = await executeQuery(
        pool,
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Check if this is admin's first login with default password
      if (user.username === 'admin' && password === 'admin123') {
        // Update last login time
        await executeQuery(
          pool,
          'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
          [user.id]
        );
        
        return res.json({
          success: true,
          message: 'Login successful',
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role
          }
        });
      }
      
      // Check if user has temporary password
      if (password === 'temp123') {
        return res.json({
          success: false,
          firstLogin: true,
          message: 'Please change your temporary password'
        });
      }
      
      // Check password
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
      }
      
      // Update last login time
      await executeQuery(
        pool,
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );
      
      // Return success with user info (omit password)
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role
        }
      });
      
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error processing login request'
      });
    }
  });
  
  return router;
};
