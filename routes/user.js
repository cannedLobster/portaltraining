var express = require('express');
var mongoose = require('mongoose');
var UserModel = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.json([]);
});
router.post('/', function(req, res) {
  var body = req.body;
  var newUser = new UserModel(body);
  newUser.save(function(err, doc) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});

module.exports = router;
