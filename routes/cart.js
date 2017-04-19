var express = require('express');
var mongoose = require('mongoose');
var CartModel = require('../models/cart'); //.js is implied
var router = express.Router();


router.post('/', function(req, res) {
    var body = req.body;
    var items = body.items; //update items
    var userId = req.session.user._id;
    var cartBody = {
        userId,
        items,
        totalCost: CartModel.findTotalCost(items),
        totalQty: CartModel.findTotalQty(items)
    }
    CartModel
        .findOneAndUpdate({
            userId
        }, cartBody, {
            upsert: true,
            new: true
        })
        .then(function(updatedCart) {
            res.json(updatedCart);
        })
        .catch(function(err) {
            res.send(err);
        });
}); // Insert updated cart items w/ qty
//RETURN ENTIRE CART
router.get('/', function(req, res) {
    CartModel.findOne({
        userId: req.session.user._id
    }, function(err, cart) {
        if (err) {
            res.send(err);
        } else {
            if (!cart) {
                res.json({
                    items: [],
                    totalCost: 0,
                    totalQty: 0
                });
            } else {
                res.json(cart);
            }
        }
    });
});

module.exports = router;
