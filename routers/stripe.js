const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');

// webhook for Stripe
router.post('/webhook', express.raw({ type: "application/json" }), async function (req, res) {
    let event = null;
    try {
        // verify the webhook signature
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            'message': `Webhook error: ${error}`
        })
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log(session.metadata);
        orderService.updateOrderStatus(session.metadata.orderId, "processing");

    }
    res.json({
        'message': 'Webhook successfully handled'
    })

})

module.exports = router;