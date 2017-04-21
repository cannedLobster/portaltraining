var express = require('express');
var mongoose = require('mongoose');
var UserModel = require('../models/user');

//Generating new guest session with a unique ID
var uuid = require('uuid/v4');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    //User session exists
      res.render('index', {title: "MENU", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
  } else {
    var guestID = uuid();
    req.session.user = {
      guestID,
      name: 'Guest',
      guest: true
    };
    res.render('index', {title: "MENU", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
  }
});
router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

module.exports = router;
