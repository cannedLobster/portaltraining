var express = require('express');
var mongoose = require('mongoose');
var CartModel = require('../models/cart'); //.js is implied
var router = express.Router();


router.post('/', function(req, res) {
  var body = req.body;
  var newCart = new CartModel(body); // or you can use { name: body.name...
    //error and documentation
  newCart.save(function(err, doc) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});
router.get('/', function(req, res) {
  //TODO: gets all menu Items
  CartModel.find({}, function(err, docs) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(docs);
    }
  });
  //res.send("alternative plain text response");
});
router.get('/:id', function(req, res) {
    CartModel.find({'_id': req.params.id}, function(err, doc) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.json(doc);
      }
    });
});
router.patch('/:id', function(req, res) {
  CartModel.updateOne({"_id": req.params.id}, {
    $set: req.body
  }, function(err, doc) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});
//Increment patch
router.patch('/:id/inc', function(req, res) {
  CartModel.updateOne({"_id": req.params.id}, {
    $inc: {qty: 1}
  }, function(err, doc) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});
router.delete('/:id', function(req, res) {
  var cartID = req.params.id;
  CartModel.deleteOne({"_id": cartID}, function(err, doc){
    if (err) {
      console.log(err);
      res.send(err);
    } else  {
      res.json(doc);
    }
  });
});

module.exports = router;
