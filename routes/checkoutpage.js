var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('checkout', {title: "CHECKOUT"});
});

module.exports = router;
