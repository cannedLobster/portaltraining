var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('cart', {title: "CART"});
});

module.exports = router;
