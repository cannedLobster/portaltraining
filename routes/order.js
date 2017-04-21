var express = require('express');
var mongoose = require('mongoose');
var OrderModel = require('../models/order');

var router = express.Router();
/*Post for registration form*/
router.post('/', function(req, res) {
  var body = req.body;
  var newOrder = new OrderModel({
    user: req.session.user,
    cart: body.cart,
    phone: body.phone,
    delivery: body.delivery,
    address: body.delivery ? body.address : '',
    card: body.delivery ? body.card : ''
  });
  newOrder.save(function(err, order) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        success: true,
        userId: order.cart.userId
      });
    }
  });
});
router.get('/', function(req, res) {
  OrderModel.find({}, function(err, orders) {
    if (err) {
      res.send(err);
    } else {
      res.json(orders);
    }
  });
});

module.exports = router;
