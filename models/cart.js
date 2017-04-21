var mongoose = require('mongoose');

var item = {
  item: Object, // <- Generic
  qty: Number
};
var schema = new mongoose.Schema({
    userId: String,
    items: [item],
    totalCost: Number,
    totalQty: Number
});
schema.statics.findTotalCost = function(items) {
  var total = 0;
  for (var i in items) {
    total+= parseInt(items[i].item.price) * items[i].qty;
  }
  return total;
};
schema.statics.findTotalQty = function(items) {
  var total = 0;
  for (var i in items) {
    total += parseInt(items[i].qty);
  }
  return total;
};

module.exports = mongoose.model('cart', schema);
