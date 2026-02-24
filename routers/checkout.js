const express = require('express');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT')
const checkoutService = require('../services/checkoutService');

const router = express.Router();

router.post("/", AuthenticateWithJWT, async(req,res)=>{
    try {
        const session = await checkoutService.checkout(req.userId);
        res.json(session);

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router;