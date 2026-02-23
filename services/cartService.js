const cartData = require('../data/cartData');

async function getCartContents(userId) {
    return await cartData.getCartContents(userId);
}

async function updateCart(userId, cartItems) {
    // check for quantity and ensure that enough items are in stock
    return await cartData.updateCart(userId, cartItems)
}

module.exports = {
    getCartContents,
    updateCart
}