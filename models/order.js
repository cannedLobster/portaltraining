var mongoose = require('mongoose');

var order = {
  user: Object,
  cart: Object,
  delivery: Boolean,
  phone: String,
  address: String,
  card: Number,
  cost: {
    delivery: Number,
    tax: Number,
    final: Number
  }
};

module.exports = mongoose.model('order', order);
