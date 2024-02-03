const mongoose = require('mongoose');
const Chats = mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    token: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
}, {timestamps: true })

module.exports = mongoose.model('Chat', Chats);