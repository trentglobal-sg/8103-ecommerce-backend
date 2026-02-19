const productData = require('../data/productData');

async function getAllProducts() {
    // any business logic here
    return await productData.getAllProducts();
}

async function getProductById(id) {
    // any business logic
    return await productData.getProductById(id)
}

module.exports = {
    getAllProducts, getProductById 
}