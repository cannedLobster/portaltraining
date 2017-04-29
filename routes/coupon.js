var express = require('express');
var mongoose = require('mongoose');
var CouponModel = require('../models/coupon'); //.js is implied
var router = express.Router();

router.post('/', function(req, res) {
  var body = req.body;
  var newCoupon = new CouponModel({
    name: body.name,
    code: body.code,
    type: body.type,
    uses: body.uses,
    val: body.val,
    active: true
  });
  newCoupon.save(function(err, coupon) {
    if (err) res.send(err);
    else {
      res.json(coupon);
    }
  });
});
//Use coupon
router.post('/use/:code', function(req, res) {
  var code = req.params.code;
  CouponModel.findOne({code}, function(err, coupon) {
    if (!coupon)
      res.status(401).json({error: 'Coupon not found'});
    else if (coupon.uses < 1){
      res.status(401).json({error: 'No more uses for coupon'});
    } else if (!coupon.active) {
      res.status(401).json({error: 'Coupon inactive'});
    }
    else {
      CouponModel.update({_id: coupon._id}, {$inc: {uses: -1}}, function(err, doc) {
        coupon.uses--;
        res.json(coupon);
      });
    }
  });
});
// Disable coupon
router.post('/disable/:id', function(req, res) {
  var id = req.params.id;
  CouponModel.update({_id: id}, {$set: {active: false}}, function(err, coupon) {
    if (err) res.send(err);
    else res.json({success: true});
  });
});
// Get all coupons
router.get('/', function(req, res) {
  CouponModel.find({}, function(err, coupons) {
    if (err) res.send(err);
    else res.json(coupons);
  });
});

router.delete('/', function(req, res) {
  CouponModel.deleteMany({}, function(err, doc) {
    if(err) res.send(err);
    else res.json({success:true});
  });
});

module.exports = router;
