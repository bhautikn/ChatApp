const mongoose = require('mongoose');

const Scema = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
    },
    text:{
        type: String,
        require: true,
    },
    like: {
        type: Number,
        default: 0,
    },
    from:{
        type: String,
        require: true,
    },
    postId: {
        type: mongoose.Types.ObjectId,
        require: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', Scema);