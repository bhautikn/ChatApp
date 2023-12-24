const express = require('express');
var cors = require('cors');
const crypto = require('crypto');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')({ cors: { origin: '*' } });
const Chats = require('./mongo_scema/Chats');
const mongoose = require('mongoose');
const md5 = require('md5');

require('./soket')(io);

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/get-id', (req, res) => {
    id = crypto.randomBytes(20).toString('hex');
    res.send({ token: id })
})
app.post('/crete-chat', async (req, res)=>{
    password = req.body.password;
    token = req.body.token;
    try{
        await new Chats({
            _id: new mongoose.Types.ObjectId(),
            token: token,
            password: md5(password)
        }).save();
        res.json({status: 200});
    }catch(e){
        console.log(e);
        res.json({status: 500});
    }

})
server.listen(3000, () => {
    console.log("App listing on", 3000);
})
io.attach(server);