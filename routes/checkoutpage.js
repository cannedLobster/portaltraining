var express = require('express');
var uuid = require('uuid/v4');

var router = express.Router();

router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    //User session exists
      res.render('checkout', {title: "CHECKOUT", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
  } else {
    res.redirect('/');
  }
});

module.exports = router;
