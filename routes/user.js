var express = require('express');
var mongoose = require('mongoose');
var UserModel = require('../models/user');
var router = express.Router();

/*Post for registration form*/
router.post('/', function(req, res) {
  var body = req.body;
  var hashedpassword = req.body.pass; //temp
  var newUser = new UserModel({
    user: body.user,
    pass: body.pass,
    email: body.email,
    name: body.name
  });
  newUser.save(function(err, doc) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});
/*Post for login*/
router.post('/login', function(req, res) {
  var body = req.body;
  var hashedpassword = req.body.pass; //temp
  UserModel.find({
    user: body.user,
    pass: hashedpassword
  }, function(err, doc) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});

module.exports = router;
