const express = require('express');
const stockRoutes = require('./api/stock');

const router = express.Router();

router.use('/api', stockRoutes);

module.exports = router;