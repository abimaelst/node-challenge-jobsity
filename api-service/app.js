require('dotenv').config();

const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');
const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/api-service-db')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error. Please make sure MongoDB is running. Error:', err);
        process.exit(1);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(auth);

app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({ error: err.message });
});

module.exports = app;
