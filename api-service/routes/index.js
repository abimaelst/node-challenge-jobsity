const express = require('express');
const router = express.Router();
const User = require('../models/User');
const StockQuote = require('../models/StockQuote');
const axios = require('axios');

router.post('/register', async (req, res, next) => {
  try {
    const { email, role } = req.body;
    const password = require('crypto').randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    res.json({ email, password });
  } catch (error) {
    next(error);
  }
});

router.get('/stock', async (req, res, next) => {
  try {
    const stockCode = req.query.q;
    const stockInfo = await axios.get(`http://localhost:3002/stock?q=${stockCode}`);

    const stockQuote = new StockQuote({
      userId: req.user._id,
      ...stockInfo.data
    });
    await stockQuote.save();

    res.json(stockInfo.data);
  } catch (error) {
    next(error);
  }
});

router.get('/history', async (req, res) => {
  try {
    const history = await StockQuote.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  try {
    const stats = await StockQuote.aggregate([
      { $group: { _id: "$symbol", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;