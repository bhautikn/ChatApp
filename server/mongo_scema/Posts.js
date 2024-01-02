const mongoose = require('mongoose');

const Scema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    title:{
        type: String,
        require: true,
        trim: true,
    },
    description:{
        type: String,
        require: true,
        trim: true,
    },
    files: {
        type: String,
        require: false,
        default: [],
    },
    like:{
        type: Number,
        require: false,
        default: 0,
    },
    dislike:{
        type: Number,
        require: false,
        default: 0,
    },
    view:{
        type: Number,
        require: false,
        default: 0,
    },
    tag: {
        type: Array,
        default: [],
        require: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', Scema);