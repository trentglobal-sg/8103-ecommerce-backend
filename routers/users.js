const express = require('express');

const userService = require('../services/userService')

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

router.get('/me', async function(req,res){
    res.json({
        "message": "Get current logged in user"
    })
})

router.put("/me", async function(req,res){
    res.json({
        "message": "modify current logged in user"
    })
})

module.exports = router;