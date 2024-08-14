const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// schema is created
const transactionSchema = new Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
});

// Export the module
const Product = mongoose.model('Transaction', transactionSchema);
module.exports = Product;
