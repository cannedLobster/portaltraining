var mongoose = require('mongoose');

var schema = {
  name: String,
  price: Number,
  img: String,
  qty: Number,
  menu_id: Number
};

module.exports = mongoose.model('cart', schema);
