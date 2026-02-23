const express = require('express');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT');

const cartService = require('../services/cartService');

const router = express.Router();

router.get('/', [AuthenticateWithJWT], async function(req,res){
    const cart = await cartService.getCartContents(req.userId)
    res.json(cart)
})

router.put('/', [AuthenticateWithJWT], async function(req,res){
    const cartItems = req.body.cartItems;
    await cartService.updateCart(req.userId, cartItems);
    res.json({
        'message':'Cart has been updated'
    })
})

module.exports = router;