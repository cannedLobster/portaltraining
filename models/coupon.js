var mongoose = require('mongoose');

var coupon = new mongoose.Schema({
  name: String,
  code: String,
  type: String,
  uses: Number,
  val: Number,
  active: Boolean
});


module.exports = mongoose.model('coupon', coupon);
