const express = require('express');
const productService = require('../services/productService')

// create a new router object
const router = express.Router();


// Get all the products
router.get('/', async function(req,res){
    const products = await productService.getAllProducts();
    res.json(products);
})

// Get a product by ID
router.get('/:id', async  function(req,res){
    const product = await productService.getProductById(req.params.id);
    res.json(product);
})

module.exports = router;