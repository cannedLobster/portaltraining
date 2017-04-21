var express = require('express');
var mongoose = require('mongoose');
var UserModel = require('../models/user');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.session && req.session.user) { // Should always be true
    UserModel.findOne({user: req.session.user.user}, function(err, user) {
      if (!user) {
        res.render('cart', {title: "LOGIN", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
      } else {
        res.render('cart', {title: "LOGIN", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
      }
    })
  } else {
    req.session.user = {
      name: 'Guest Session',
      guest: true
    };
    res.render('index', {title: "CART", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
  }
});

module.exports = router;
