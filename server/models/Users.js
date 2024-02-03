const mongoose = require('mongoose');

const user = mongoose.Schema({
    _id:mongoose.Types.ObjectId,
    id:{
        type: String,
        require: true,
    },
    friend: {
        type: String
    },
    auth: {
        type: Boolean,
        require: true,
    },
    token:{
        type: String,
        require: true
    },
    online: {
        type: Boolean,
        require: true,
    }
}, { timestamps: true });


module.exports =  mongoose.model('User', user);