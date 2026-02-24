const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * 
 * @param {int} userId ID of the user placing the order
 * @param {[{
 *  product_id: int,
 *  quantity: int
 *  product_name : string,
 *  imageUrl: string,
 *  price: float
 * }]} orderItems The content of the shopping cart
 * @param {*} orderId 
 */
async function createCheckoutSession(userId, orderItems, orderId) {
    console.log("orderId = ", orderId);
   
    // 1. create line items
    const lineItems = createLineItems(orderItems);

    // 2. create the checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: 'https://www.google.com',
        cancel_url: 'https://www.yahoo.com',
        metadata: {
            userId: userId,
            orderId: orderId
        }

    })

    // 3. return the session
    return session;
}

/**
 * 
 * @param {[{
 *  product_id: int,
 *  quantity: int
 *  product_name : string,
 *  imageUrl: string,
 *  price: float
 * }]} orderItems The content of the shopping cart
 */
function createLineItems(orderItems) {
    console.log(orderItems);
    // each line item must follow an exact format
    const lineItems = [];
    for (let orderItem of orderItems) {
        const item = {
            price_data: {
                currency: 'sgd',
                product_data: {
                    name: orderItem.name,
                    images: [orderItem.imageUrl || 'https://placehold.co/400'],
                    metadata:{
                        product_id: orderItem.product_id
                    }
                },
                unit_amount: Math.round(orderItem.price * 100)
            },
            quantity: orderItem.quantity
        }
        lineItems.push(item);
    }
    return lineItems;
}

module.exports = {
    createCheckoutSession
}