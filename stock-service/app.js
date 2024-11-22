const createError = require('http-errors');
const express = require('express');
const axios = require('axios');
const logger = require('morgan');
const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

app.get('/stock', async (req, res) => {
  const stockCode = req.query.q;
  try {
    const response = await axios.get(`https://stooq.com/q/l/?s=${stockCode}&f=sd2t2ohlcvn&h&e=csv`);
    const data = response.data.split('\n')[1].split(';');
    if (data.length < 9) throw new Error('Invalid stock data format');

    const [, date, time, open, high, low, close, volume, name] = data;

    res.json({
      name,
      symbol: stockCode,
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      close: parseFloat(close),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch or parse stock data' });
  }
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;