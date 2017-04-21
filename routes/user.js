var express = require('express');
var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var UserModel = require('../models/user');

var router = express.Router();
/*Post for registration form*/
router.post('/', function(req, res) {
  var body = req.body;
  UserModel.find({$or:
    [{email: body.email.trim()},
    {user: body.user.trim()}]}, function (err, doc) {
    if (err) {
      res.send(err);
    } else {
      if (!doc.length) {
        var newUser = new UserModel({
          user: body.user.trim(),
          email: body.email.trim(),
          pass: UserModel.hashPassword(body.pass.trim()),
          name: body.name.trim()
        });
        newUser.save(function(err, doc) {
          if (err) {
            res.send(err);
          } else {
            doc.guest = false;
            req.session.user = UserModel.removePass(doc);
            // SET COOKIE HEADER with User w/o password
            res.json({success: true});
          }
        });
      } else {
        res.json({success: false});
      }
    }
  });
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
