
module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { executeQuery } = require('../db');
  
  // Get all users
  router.get('/', async (req, res) => {
    try {
      const users = await executeQuery(pool, 'SELECT * FROM users');
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get user by username
  router.get('/username/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const [user] = await executeQuery(
        pool,
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user by username:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Create a new user
  router.post('/', async (req, res) => {
    try {
      const user = req.body;
      const result = await executeQuery(
        pool,
        `INSERT INTO users 
         (id, name, username, password, role, status, last_login) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id, 
          user.name, 
          user.username, 
          user.password, 
          user.role, 
          user.status, 
          user.last_login
        ]
      );
      
      const [newUser] = await executeQuery(
        pool,
        'SELECT * FROM users WHERE id = ?',
        [user.id]
      );
      
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update a user
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.body;
      
      await executeQuery(
        pool,
        `UPDATE users 
         SET name = ?, username = ?, role = ?, status = ?, last_login = ? 
         WHERE id = ?`,
        [
          user.name, 
          user.username, 
          user.role, 
          user.status, 
          user.last_login, 
          id
        ]
      );
      
      // If password is provided, update it separately
      if (user.password) {
        await executeQuery(
          pool,
          'UPDATE users SET password = ? WHERE id = ?',
          [user.password, id]
        );
      }
      
      const [updatedUser] = await executeQuery(
        pool,
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a user
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await executeQuery(
        pool,
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update last login
  router.put('/:id/last-login', async (req, res) => {
    try {
      const { id } = req.params;
      await executeQuery(
        pool,
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error updating last login:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  return router;
};
