const express = require('express');
const pool = require('../database')

// create a new router object
const router = express.Router();


// Get all the products
router.get('/', async function(req,res){
    const [rows] = await pool.execute("SELECT * FROM products");
    res.json({
        'message': rows
    })
})

router.get('/:id', function(req,res){
    res.json({
        'message': "Getting product with ID " + req.params.id
    })
})

module.exports = router;