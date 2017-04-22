var express = require('express');
//Generating new guest session with a unique ID
var uuid = require('uuid/v4');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session && req.session.user) {
    //User session exists
    res.render('receipt', {title: "RECEIPT", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
  } else {
    var guestID = uuid();
    req.session.user = {
      guestID,
      name: 'Guest',
      guest: true
    };
    res.render('receipt', {title: "RECEIPT", usermsg: "Welcome, " + req.session.user.name, guest: req.session.user.guest});
  }
});


module.exports = router;
