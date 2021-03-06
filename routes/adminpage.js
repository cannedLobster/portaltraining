var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.session && req.session.user) { // Should always be true
    res.render('admin', {title: "Coupon Page", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
  } else {
    res.redirect('/');
  }
});

module.exports = router;
