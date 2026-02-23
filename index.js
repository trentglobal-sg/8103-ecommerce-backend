const express = require('express');
const cors = require('cors');
require('dotenv').config();

// make sure all libraries requires
// come first first, the your own modules
const pool = require('./database');
const productRouter = require('./routers/products');
const userRouter = require('./routers/users');
const cartRouter = require('./routers/cart');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    res.send({
        "message": "It's alive"
    })
})

// register the products router with the URL "/api/products"
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use('/api/cart', cartRouter);

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running");
    
})