const express = require('express');
const axios = require('axios');
const createError = require('http-errors');

const router = express.Router();

/**
 * GET /api/stock
 * Fetch stock information based on the stock code.
 * Query Parameter: `q` - Stock code (e.g., 'AAPL').
 */
router.get('/stock', async (req, res, next) => {
    const stockCode = req.query.q;

    if (!stockCode) {
        return res.status(400).json({ error: 'Stock code is required' });
    }

    try {
        const response = await axios.get(
            `${process.env.STOCK_API_URL}?s=${stockCode}&f=sd2t2ohlcvn&h&e=csv`
        );

        const csvLines = response.data.split('\n');
        if (csvLines.length < 2 || csvLines[1].trim() === '') {
            return res.status(404).json({ error: 'Stock data not found' });
        }

        const [, , , open, high, low, close, , name] = csvLines[1].split(';');

        res.json({
            symbol: stockCode.toUpperCase(),
            name,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
        });
    } catch (error) {
        if (error.response) {
            return next(createError(error.response.status, error.response.statusText));
        }
        return next(error);
    }
});

module.exports = router;