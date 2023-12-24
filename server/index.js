const express = require('express');
const crypto = require('crypto');
var cors = require('cors');
const app = express();


app.use(cors({ origin: '*' }));

app.get('/get-id', (req, res)=>{
    id = crypto.randomBytes(20).toString('hex');
    res.send({token:id})
})

app.listen(3000, ()=>{
    console.log("App listing on", 3000);
})
