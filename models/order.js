var mongoose = require('mongoose');

var order = {
  user: Object,
  cart: Object,
  delivery: Boolean,
  phone: String,
  address: String,
  card: Number
};

module.exports = mongoose.model('order', order);
