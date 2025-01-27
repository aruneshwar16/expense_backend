const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const Transaction = require('./models/Transaction');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
console.log('Connecting to MongoDB...');
mongoose.connect('mongodb://localhost:27017/expense')
.then(() => console.log('MongoDB Connected Successfully!'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();
    res.json(savedTransaction);
  } catch (err) {
    console.error('Error adding transaction:', err);
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const result = await Transaction.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted', transaction: result });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Error deleting transaction' });
  }
});

const PORT = 9004;

app.listen(PORT,() => {
  console.log(`Server running at http://localhost:${PORT}`);
});
