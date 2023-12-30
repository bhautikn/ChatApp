const express = require('express');
var cors = require('cors');
const crypto = require('crypto');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')({ cors: { origin: '*' } });
const Chats = require('./mongo_scema/Chats');
const mongoose = require('mongoose');
const md5 = require('md5');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');
// const Posts = require('./mongo_scema/Posts')
// const Reports = require('./mongo_scema/Reports')
require('./soket')(io);

dotenv.config();
const SIGN = process.env.JWT_SECRET_KEY;
app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/post/new', (req, res)=>{

})

///////////////////////////////////////////////////////////////////////////
app.post('/crete-chat', async (req, res)=>{
    password = req.body.password;
    token = crypto.randomBytes(20).toString('hex');
    if(!password){
        return res.json({status: 403});
    }
    try{
        await new Chats({
            _id: new mongoose.Types.ObjectId(),
            token: token,
            password: md5(password)
        }).save();
    res.send({status: 200,  token: token })
    }catch(e){
        console.log(e);
        res.json({status: 500});
    }
})
app.delete('/chat/:id', (req, res)=>{
    token = req.headers.token;
    id = req.header.id;
    console.log(token);
    if(!token)
        return res.json({ok: 0})
    jwt.verify(token, SIGN, (err)=>{
        if(!err){
            Chats.deleteOne({token: id});
            return res.json({ok: 200});
        }
    })
})
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
app.post('/authanticate', async (req, res)=>{
    password = req.body.password;
    token = req.body.token;
    if(!password || !token){
        return res.json({login: false});
    }
    try{
        const data = await Chats.findOne({token:token});
        if(!data){
            return res.json({login: false});
        }
        if(data.password == md5(password)){
            const _id = jwt.sign({ token: token }, SIGN);
            return res.json({ login:true, id: _id });
        }
        else{
            return res.json({ login: false });
        }
    }catch(e){
        console.log(e);
        res.json({status: 500});
    }
})
///////////////////////////////////////////////////////////////////////////
server.listen(3000,()=>{
    console.log('server started on', 3000)
})
io.attach(server);