var mongoose = require('mongoose');

var schema = {
  name: String,
  desc: String,
  price: Number,
  img: String,
  menu_id: Number
};

module.exports = mongoose.model('menu', schema);
