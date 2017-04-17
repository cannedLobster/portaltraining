var express = require('express');
var mongoose = require('mongoose');
var UserModel = require('../models/user');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    UserModel.findOne({email: req.session.user.email}, function(err, user) {
      if (!user) {
        req.session.reset();
        res.redirect('/loginpage');
      } else {
        res.locals.user = user;
        res.render('login', {title: "LOGIN", user: "Welcome, " + req.session.user.name + "  "});
      }
    })
  } else {
    res.render('login', {title: "LOGIN", user: ""});
  }
});

module.exports = router;