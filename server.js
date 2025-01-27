const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const Transaction = require('./models/Transaction');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://expanse-tracker-gray.vercel.app'],
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://aruneshwar:aruneshwar16@cluster0.q953g.mongodb.net/Expense-tracker';
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
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

const PORT = process.env.PORT || 9004;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
