const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const auth = require('./middleware/auth');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

const app = express();

mongoose.connect('mongodb://localhost/api-service-db')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
      console.error('MongoDB connection error. Please make sure MongoDB is running. Error:', err);
      process.exit(1);
    });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(auth);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('testing')
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
