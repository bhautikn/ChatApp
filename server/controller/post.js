const mongoose = require('mongoose');
const Posts = require('../models/Posts')
const Comments = require('../models/Comments')
const { isSet, HTMLSPACIALCHAR } = require('../functions');

exports.getAllPosts =  async function (req, res){
    const data = await Posts.find();
    res.json(data);
}

exports.postByRange = async function(req, res){
    const from = req.params.from;
    const to = req.params.to;
    const data = await Posts.find().skip(from).limit(to - from);
    res.json(data);
}

exports.postById = async function(req, res){
    try {
        const data = await Posts.findOne({ _id: req.params.id });
        res.json(data);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

exports.addPost = async function(req, res){
    if (!req.body.storeFileName) {
        return res.sendStatus(403);
    }
    if (!isSet(req.body.title)) {
        return res.sendStatus(403);
    }
    let tagArray = [];
    if (isSet(req.body.tags))
        tagArray = req.body.tags.split(' ');
    fileName = req.body.storeFileName;
    const _id = new mongoose.Types.ObjectId()
    new Posts({
        _id: _id,
        title: req.body.title,
        description: req.body.description,
        files: fileName,
        // tags: tagArray,
        fileDataType: req.body.mimetype,
        $push: { tags: tagArray },
    }).save();

    res.json({ id: _id });
}

exports.addLike = async function(req, res){
    const PostId = req.params.id;
    if (!isSet(PostId)) {
        return res.sendStatus(403)
    }
    await Posts.updateOne({ _id: PostId }, { $inc: { like: 1 } });
    res.sendStatus(200);
}

exports.removeLike = async function(req, res){
    const PostId = req.params.id;
    if (!isSet(PostId)) {
        return res.sendStatus(403)
    }
    await Posts.updateOne({ _id: PostId }, { $inc: { like: -1 } });
    res.sendStatus(200);
}

exports.addDislike = async function(req, res){
    const PostId = req.params.id;
    if (!isSet(PostId)) {
        return res.sendStatus(403)
    }
    await Posts.updateOne({ _id: PostId }, { $inc: { dislike: 1 } });
    res.sendStatus(200);
}

exports.removeDislike = async function(req, res){
    const PostId = req.params.id;
    if (!isSet(PostId)) {
        return res.sendStatus(403)
    }
    await Posts.updateOne({ _id: PostId }, { $inc: { dislike: -1 } });
    res.sendStatus(200);
}

exports.addView = async function(req, res){
    const postId = req.params.id;

    if (!isSet(postId)) {
        return res.sendStatus(403)
    }
    try {
        await Posts.updateOne({ _id: postId }, { $inc: { view: 1 } });
    } catch (e) {
        console.log(e);
    }
    res.sendStatus(200);
}

exports.searchPost = async (req, res) => {
    const searchText = req.params.text;
    if (isSet(searchText)) {
        const data = await Posts.find({ title: { $regex: searchText, $options: 'i' } })
        res.json(data);
    }
}

exports.addComment =async (req, res) => {
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
}

exports.addCommentLike = async (req, res) => {
    const CommentId = req.params.id;

    if (!isSet(CommentId)) {
        return res.sendStatus(403)
    }
    await Comments.updateOne({ _id: CommentId }, { $inc: { like: 1 } });
    res.sendStatus(200);
}

exports.removeComemntLike = async (req, res)=>{
    async (req, res) => {
        const CommentId = req.params.id;
        if (!isSet(CommentId)) {
            return res.sendStatus(403)
        }
        await Comments.updateOne({ _id: CommentId }, { $inc: { like: -1 } });
        res.sendStatus(200);
    }
}

exports.getCommentsByRange = async (req, res) => {
    const postId = req.params.id;
    const from = req.params.from;
    const to = req.params.to;
    const data = await Comments.find({ postId: postId }).skip(from).limit(to - from);
    if (data.length === 0) {
        return res.json({ dataOver: true });
    }
    res.json(data);
}

