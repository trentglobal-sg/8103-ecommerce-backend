const express = require('express');
const jwt = require('jsonwebtoken');

const userService = require('../services/userService');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT');

const router = express.Router();

router.post('/register', async function(req, res){
    const user = await userService.createUser(req.body.name, req.body.email, req.body.password,
            req.body.salutation, req.body.country, req.body.marketingPreferences
    )
    res.json({
       "message": "Register successfully",
       user
    })
});

router.post('/login', async function(req,res){
    try {
        const user = await userService.login(req.body.email, req.body.password);
        const token = jwt.sign({
            userId: user.id
        }, process.env.JWT_SECRET, {
            'expiresIn': '1h'
        })
        res.json({
            user_id: user.id,
            token: token
        })
    }  catch (e) {
        console.error(e);
        res.status(400).json({
            'error':'Unable to login'
        })
    }
    

})

router.get('/me', [AuthenticateWithJWT], async function(req,res){
    const user = await userService.getUserProfile(req.userId);
    res.json({user})
})

router.put("/me", [AuthenticateWithJWT], async function(req,res){
    const user = await userService.updateUser(req.userId, 
                req.body.name,
                req.body.email,
                req.body.salutation,
                req.body.country,
                req.body.marketingPreferences
    );
    res.json({
        "message": "User modified"
    })
})

module.exports = router;