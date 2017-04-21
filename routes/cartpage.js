var express = require('express');
var mongoose = require('mongoose');
var UserModel = require('../models/user');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    //User session exists
      res.render('cart', {title: "CART", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
  } else {
    var guestID = uuid();
    req.session.user = {
      guestID,
      name: 'Guest',
      guest: true
    };
    console.log(req.session.user);
    res.render('cart', {title: "CART", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
  }
});

module.exports = router;
