
module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { executeQuery } = require('../db');
  
  // Get all categories
  router.get('/', async (req, res) => {
    try {
      const categories = await executeQuery(pool, 'SELECT * FROM categories');
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Create a new category
  router.post('/', async (req, res) => {
    try {
      const category = req.body;
      const result = await executeQuery(
        pool,
        `INSERT INTO categories 
         (id, type, name, parentid, level, isfixedexpense, isactive) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          category.id, 
          category.type, 
          category.name, 
          category.parentid, 
          category.level, 
          category.isfixedexpense, 
          category.isactive
        ]
      );
      
      const [newCategory] = await executeQuery(
        pool,
        'SELECT * FROM categories WHERE id = ?',
        [category.id]
      );
      
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update a category
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const category = req.body;
      
      await executeQuery(
        pool,
        `UPDATE categories 
         SET name = ?, type = ?, level = ?, parentid = ?, 
             isfixedexpense = ?, isactive = ? 
         WHERE id = ?`,
        [
          category.name, 
          category.type, 
          category.level, 
          category.parentid, 
          category.isfixedexpense, 
          category.isactive, 
          id
        ]
      );
      
      const [updatedCategory] = await executeQuery(
        pool,
        'SELECT * FROM categories WHERE id = ?',
        [id]
      );
      
      res.json(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a category
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await executeQuery(
        pool,
        'DELETE FROM categories WHERE id = ?',
        [id]
      );
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Clear non-root categories
  router.delete('/clear/non-root', async (req, res) => {
    try {
      const result = await executeQuery(
        pool,
        'DELETE FROM categories WHERE level > 1'
      );
      
      res.status(200).json({ 
        success: true, 
        affectedRows: result.affectedRows 
      });
    } catch (error) {
      console.error('Error clearing non-root categories:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  return router;
};
