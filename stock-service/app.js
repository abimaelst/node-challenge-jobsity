require('dotenv').config();

const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const stockRouter = require('./routes/api/stock');

const app = express();

const stockApiUrl = process.env.STOCK_API_URL;

if (!stockApiUrl) {
  console.error('Error: STOCK_API_URL is not defined in environment variables.');
  process.exit(1);
}

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/api', stockRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  const isDev = req.app.get('env') === 'development';
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: {
      message: err.message,
      ...(isDev && { stack: err.stack }),
    },
  });
});

module.exports = app;