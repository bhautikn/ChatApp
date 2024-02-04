const jwt = require('jsonwebtoken');
const md5 = require('md5');
const mongoose = require('mongoose');
const Chats = require('../models/Chats');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { mailSender } = require('../services/mailSender');


dotenv.config();
const SIGN = process.env.JWT_SECRET_KEY;

exports.createChat = async (req, res) => {
    password = req.body.password;
    token = crypto.randomBytes(20).toString('hex');
    if (!password) {
        return res.json({ status: 403 });
    }
    try {
        await new Chats({
            _id: new mongoose.Types.ObjectId(),
            token: token,
            password: md5(password)
        }).save();
        res.send({ status: 200, token: token })
    } catch (e) {
        console.log(e);
        res.json({ status: 500 });
    }
}

exports.deleteChat = async (req, res) => {
    token = req.headers.token;
    id = req.header.id;
    if (!token)
        return res.json({ ok: 0 })
    jwt.verify(token, SIGN, async (err) => {
        if (!err) {
            await Chats.deleteOne({ token: id });
            return res.json({ ok: 200 });
        }
    })
}

exports.authanticate = async (req, res) => {
    password = req.body.password;
    token = req.body.token;
    if (!password || !token) {
        return res.json({ login: false });
    }
    try {
        const data = await Chats.findOne({ token: token });
        if (!data) {
            return res.json({ login: false });
        }
        if (data.password == md5(password)) {
            const _id = jwt.sign({ token: token }, SIGN);
            return res.json({ login: true, id: _id });
        }
        else {
            return res.json({ login: false });
        }
    } catch (e) {
        console.log(e);
        res.json({ status: 500 });
    }
}

exports.sendEmail = async (req, res) => {
    console.log(req.body);
    if(!req.body.email || !req.body.chat_link || !req.body.comment){
        return res.sendStatus(403);
    }
    try {
        await mailSender(req.body);
        res.json({ status: 200 });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}