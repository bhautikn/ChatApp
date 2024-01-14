const express = require('express');
var cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')({ cors: { origin: '*' }, maxHttpBufferSize: 1e8 });
const Chats = require('./mongo_scema/Chats');
const mongoose = require('mongoose');
const md5 = require('md5');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const upload = require('./file_upload')
const Posts = require('./mongo_scema/Posts')
const Comments = require('./mongo_scema/Comments')
// const Reports = require('./mongo_scema/Reports')
require('./soket')(io);

dotenv.config();
const SIGN = process.env.JWT_SECRET_KEY;
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, 'uploads')));
/////////////////////////////////////////////////////////////

app.get('/posts', async (req, res) => {
    const data = await Posts.find();
    res.json(data);
})

app.get('/post/:id', async (req, res) => {
    try{
        const data = await Posts.findOne({ _id: req.params.id });    
        res.json(data);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

app.post('/post/new', upload.any(), (req, res) => {

    if (!req.body.storeFileName) {
        return res.sendStatus(403);
    }
    if (!isSet(req.body.title)) {
        return;
    }
    let tagArray = [];
    if (isSet(req.body.tags))
        tagArray = req.body.tags.split('\s');
    fileName = req.body.storeFileName;
    const _id = new mongoose.Types.ObjectId()
    new Posts({
        _id: _id,
        title: req.body.title,
        description: req.body.description,
        files: fileName,
        tags: [tagArray],
        fileDataType: req.body.mimetype,
    }).save();

    res.json({ id: _id });
})
app.put('/post/like/:id', async (req, res) => {
    const PostId = req.params.id;
    if (!isSet(PostId)) {
        return res.sendStatus(403)
    }
    await Posts.updateOne({ _id: PostId }, { $inc: { like: 1 } });
    res.sendStatus(200);
})
app.put('/post/dislike/:id', async (req, res) => {
    const PostId = req.params.id;
    if (!isSet(PostId)) {
        return res.sendStatus(403)
    }
    await Posts.updateOne({ _id: PostId }, { $inc: { dislike: 1 } });
    res.sendStatus(200);
})
app.put('/post/remove-like/:id', async (req, res) => {
    const PostId = req.params.id;
    if (!isSet(PostId)) {
        return res.sendStatus(403)
    }
    await Posts.updateOne({ _id: PostId }, { $inc: { like: -1 } });
    res.sendStatus(200);
})
app.put('/post/remove-dislike/:id', async (req, res) => {
    const PostId = req.params.id;
    if (!isSet(PostId)) {
        return res.sendStatus(403)
    }
    await Posts.updateOne({ _id: PostId }, { $inc: { dislike: -1 } });
    res.sendStatus(200);
})
app.put('/post/view/:id', async (req, res) => {
    const PostId = req.params.id;
    if (!isSet(PostId)) {
        return res.sendStatus(403)
    }
    await Posts.updateOne({ _id: PostId }, { $inc: { view: 1 } });
    res.sendStatus(200);
})

app.put('/post/comment/like/:id', async (req, res) => {
    const CommentId = req.params.id;
    if (!isSet(CommentId)) {
        return res.sendStatus(403)
    }
    await Comments.updateOne({ _id: CommentId }, { $inc: { like: 1 } });
    res.sendStatus(200);
})
app.put('/post/comment/remove-like/:id', async (req, res) => {
    if (!isSet(CommentId)) {
        return res.sendStatus(403)
    }
    const CommentId = req.params.id;
    const comment_id = await Comments.updateOne({ _id: CommentId }, { $inc: { like: -1 } });
    res.sendStatus(200);
})

app.get('/post/comments/:id/', async (req, res) => {
    const postId = req.params.id;
    const data = await Comments.find({ postId: postId })
    res.json(data);
})
app.get('/posts/search/:text', async (req, res) => {
    const searchText = req.params.text;
    if (isSet(searchText)) {
        const data = await Posts.find({ title: { $regex: searchText , $options: 'i' } })
        res.json(data);
    }
})
app.post('/post/add-comment/', async (req, res) => {
    const postId = req.body.postId;
    const text = req.body.text;
    const from = req.body.from;

    if (!isSet(postId) || !isSet(text) || !isSet(from)) {
        return res.sendStatus(403);
    }
    await Posts.updateOne({ _id: postId }, { $inc: { comments: 1 } });
    const data = await new Comments({
        _id: new mongoose.Types.ObjectId(),
        text: HTMLSPACIALCHAR(text),
        postId: postId,
        from: HTMLSPACIALCHAR(from),
    }).save();
    res.json({ _id: data._id });
})

///////////////////////////////////////////////////////////////////////////


app.post('/crete-chat', async (req, res) => {
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
})
app.delete('/chat/:id', (req, res) => {
    token = req.headers.token;
    id = req.header.id;
    if (!token)
        return res.json({ ok: 0 })
    jwt.verify(token, SIGN, (err) => {
        if (!err) {
            Chats.deleteOne({ token: id });
            return res.json({ ok: 200 });
        }
    })
})
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
app.post('/authanticate', async (req, res) => {
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
})
///////////////////////////////////////////////////////////////////////////
server.listen(3000, () => {
    console.log('server started on', 3000)
})
io.attach(server);

function isSet(args) {
    if (!args || args == '' || args.trim() == '')
        return false;
    return true;
}

function HTMLSPACIALCHAR(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
}