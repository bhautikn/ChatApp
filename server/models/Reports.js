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
    postId:{
        typeof: mongoose.Types.ObjectId,
        require: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', Scema);