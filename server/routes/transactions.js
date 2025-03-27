
module.exports = (pool) => {
  const express = require('express');
  const router = express.Router();
  const { executeQuery } = require('../db');
  
  // Get all transactions
  router.get('/', async (req, res) => {
    try {
      const transactions = await executeQuery(pool, 'SELECT * FROM transactions');
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Create a new transaction
  router.post('/', async (req, res) => {
    try {
      const transaction = req.body;
      const result = await executeQuery(
        pool,
        `INSERT INTO transactions 
         (id, date, amount, description, categoryid, type) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transaction.id, 
          transaction.date, 
          transaction.amount, 
          transaction.description, 
          transaction.categoryid, 
          transaction.type
        ]
      );
      
      const [newTransaction] = await executeQuery(
        pool,
        'SELECT * FROM transactions WHERE id = ?',
        [transaction.id]
      );
      
      res.status(201).json(newTransaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a transaction
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await executeQuery(
        pool,
        'DELETE FROM transactions WHERE id = ?',
        [id]
      );
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  return router;
};
