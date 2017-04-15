var express = require('express');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var UserModel = require('../models/user');
var router = express.Router();

/*Post for registration form*/
router.post('/', function(req, res) {
  var body = req.body;
  console.log(req.body.pass);
  var hashedpassword = passwordHash.generate(req.body.pass);
  console.log(hashedpassword);
  var newUser = new UserModel({
    user: body.user,
    pass: hashedpassword,
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
router.post('/login/', function(req, res) {
  var body = req.body;
  var hashedpassword = passwordHash.generate(body.pass);
  UserModel.findOne({
    user: body.user.trim()
  }, function(err, doc) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(hashedpassword);
      console.log(doc.pass);
      if (hashedpassword == doc.pass){
        res.json(doc);
      }
      else {
        res.status(401).json({
        error: 'Invalid credentials'
      });
        //unauthorized
      }
    }
  });
});

module.exports = router;
