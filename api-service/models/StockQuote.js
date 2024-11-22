const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockQuoteSchema = new Schema({
    userId: Schema.Types.ObjectId,
    symbol: String,
    name: String,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StockQuote', stockQuoteSchema);