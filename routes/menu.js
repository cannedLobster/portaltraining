var express = require('express');
var mongoose = require('mongoose');
var MenuModel = require('../models/menu'); //.js is implied
var router = express.Router();

//Don't declare models here


router.post('/', function(req, res) {
  var body = req.body;
  var newMenu = new MenuModel(body); // or you can use { name: body.name...
    //error and documentation
  newMenu.save(function(err, doc) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});

router.get('/', function(req, res) {
  MenuModel.find({}, function(err, docs) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(docs);
    }
  })
  //res.send("alternative plain text response");
});

router.patch('/:id', function(req, res){
  var menuID = req.params.id;
  MenuModel.updateOne({"_id": req.params.id}, {
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

router.delete('/:id', function(req, res) {
  var menuID = req.params.id;
  MenuModel.deleteOne({"_id": menuID}, function(err, doc){
    if (err) {
      console.log(err);
      res.send(err);
    } else  {
      res.json(doc);
    }
  });
});


module.exports = router;
