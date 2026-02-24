const express = require('express');
const cors = require('cors');
require('dotenv').config();

// make sure all libraries requires
// come first first, the your own modules
const pool = require('./database');
const productRouter = require('./routers/products');
const userRouter = require('./routers/users');
const cartRouter = require('./routers/cart');
const checkoutRouter = require('./routers/checkout');
const stripeRouter = require('./routers/stripe')

const app = express();

// we disable express.json globally for all the routes
// because it will tamper with the stripe webhook signature
// app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    res.send({
        "message": "It's alive"
    })
})

// manually using express.json for all routes but not for the webhook
app.use("/api/products", express.json(), productRouter);
app.use("/api/users", express.json(), userRouter);
app.use('/api/cart', express.json(), cartRouter);
app.use('/api/checkout', express.json(), checkoutRouter);
app.use('/api/stripe', stripeRouter);

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running");
    
})