const express = require('express');
const crypto = require('crypto');
const app = express();

app.get('/get-id', (req, res)=>{
    id = crypto.randomBytes(32).toString('hex');
    res.send({code:id})
})

app.listen(3000, ()=>{
    console.log("App listing on", 3000);
})
