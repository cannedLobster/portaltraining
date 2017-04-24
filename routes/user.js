var express = require('express');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var UserModel = require('../models/user');
var CartModel = require('../models/cart');

var router = express.Router();
/*Post for registration form*/
router.post('/', function(req, res) {
  var body = req.body;
  if (req.session.user.guest) {
    var guestId = req.session.user.guestID;
    var items;
    CartModel.findOne({userId: guestId})
    .then(function(cart) {
      items = cart ? cart.items : null;
      return UserModel.find({$or: [{
        email: body.email.trim(),
        user: body.user.trim()
      }]});
    })
    .then(function(users) {
      if (!users.length) {
        var newUser = new UserModel({
          user: body.user.trim(),
          email: body.email.trim(),
          pass: UserModel.hashPassword(body.pass.trim()),
          name: body.name.trim()
        });
        return newUser.save(newUser);
      } else {
        res.json({success: false})
      }
    })
    .then(function(newUser) {
      req.session.user = UserModel.removePass(newUser);
      var userId = req.session.user._id;
      if (items) {
        var cartBody = {
          userId,
          items,
          totalCost: CartModel.findTotalCost(items),
          totalQty: CartModel.findTotalQty(items)
        };
        return CartModel.findOneAndUpdate({userId},cartBody,{
          upsert: true,
          new: true
        });
      }
      else {
        res.json({success: true});
      }
    })
    .then(function(updatedCart) {
      return CartModel.deleteOne({userId: guestId})
    })
    .then(function(deletedCart) {
      res.json({success: true});
    })
    .catch(function(err) {
      res.send(err);
    });
  } else {
    res.json({success: false});
  }
});
/*Post for login*/
router.post('/login', function(req, res) {
  var body = req.body;
  UserModel.findOne({
    user: body.user.trim()
  }, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      if (!doc) res.status(401).json({error:'Invalid Credentials'});
      else if (passwordHash.verify(body.pass, doc.pass)) {
        req.session.user = UserModel.removePass(doc); // Set CookieHeader
        res.json({success: true});
      }
      else //unauthorized Password
        res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
    }
  });
});
/*Delete*/
router.delete('/', function(req, res) {
  var user = req.params.user;
  UserModel.deleteMany({}, function(err, doc) {
    if(err){
      res.send(err);
    } else {
      res.send({success: true});
    }
  });
});

module.exports = router;
