var mongoose = require('mongoose');

var schema = {
  name: String,
  user: String,
  email: String,
  pass: String
};

module.exports = mongoose.model('user', schema);
