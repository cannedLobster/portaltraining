var express = require('express');
var mongoose = require('mongoose');
var UserModel = require('../models/user');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    res.render('index', {title: "MENU", user: "Welcome, " + req.session.user.name});

  } else {
    res.render('index', {title: "MENU", user: ""});
  }
  // res.render('index', {title: "MENU"});
});
router.get('/logout', function(req, res) {
  req.session.reset();
  res.render('index', {title: "MENU", user: ""});
});

module.exports = router;
