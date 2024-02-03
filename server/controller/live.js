const jwt = require('jsonwebtoken');
const Live = require('../models/Live');

exports.addLive = async (req, res) => {

    if (!isSet(req.body.title)) {
        return res.sendStatus(403);
    }
    let tagArray = [];
    if (isSet(req.body.tags))
        tagArray = req.body.tags.split(' ');
    
    const _id = new mongoose.Types.ObjectId()
    console.log(tagArray);
    new Live({
        _id: _id,
        title: req.body.title,
        description: req.body.description,
        files: fileName,
        tags: tagArray,
        fileDataType: req.body.mimetype,
    }).save();
    res.json({ token: jwt.sign({ id: _id }, SIGN) });
}