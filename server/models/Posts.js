const mongoose = require('mongoose');

const Scema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title: {
        type: String,
        require: true,
        trim: true,
    },
    description: {
        type: String,
        require: true,
        trim: true,
    },
    files: {
        type: String,
        require: false,
    },
    fileDataType: {
        type: String,
        require: false,
    },
    like: {
        type: Number,
        default: 0,
    },
    dislike: {
        type: Number,
        default: 0,
    },
    view: {
        type: Number,
        default: 0,
    },
    comments: {
        type: Number,
        default: 0,
    },
    tag: [String],
}, { timestamps: true });

module.exports = mongoose.model('Post', Scema);