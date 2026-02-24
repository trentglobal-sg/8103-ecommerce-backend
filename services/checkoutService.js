const cartService = require('./cartService');
const orderService = require('./orderService');
const stripeService = require('./stripeService');

async function checkout(userId) {
    // 1. get the content of the shopping cart
    const cartItems = await cartService.getCartContents(userId);

    // 2. create a new order 
    const orderId = await orderService.createOrder(userId, cartItems);

    // 3. create a checkout session
    const session = await stripeService.createCheckoutSession(userId, cartItems, orderId);

    // 4. update the order with the checkout session's id
    await orderService.updateOrderSessionId(orderId, session.id);

    // 5. optional: empty the shopping cart

    return session;
}

module.exports = {
    checkout
}