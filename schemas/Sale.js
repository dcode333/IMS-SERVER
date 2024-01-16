const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerType: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
