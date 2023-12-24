const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Users = require('./mongo_scema/Users');
const Chats = require('./mongo_scema/Chats');

dotenv.config();
const SIGN = process.env.JWT_SECRET_KEY;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(() => {
    console.log('Database Connected');
});


// let Users = {};
// let Chats = { '6f4133614c9ef6996ee72c81bb157e6af60c9b78': { password: 'bhautik123' } }
module.exports = (io) => {

    io.on('connection', (socket) => {

        new Users({
            _id: new mongoose.Types.ObjectId(),
            id: socket.id,
            token: '',
            auth: false,
        }).save();

        socket.on('authaticate', async (token, password) => {
            await Users.updateOne({ id: socket.id }, { $set: { token: token } });
            const data = await Chats.findOne({ id: token });
            if (data) {
                if (data.password == password) {
                    const auth_token = jwt.sign({ token: token }, SIGN)

                    io.to(socket.id).emit('id', auth_token);

                }
            }
        })

        socket.on('massage', (massage, id) => {
            jwt.verify(id, SIGN, (data) => {
                if (Chats[data.token]) {
                    const freind = Chats[data.token].freind;
                    io.to().emit('recive')
                }
            })
        })


        socket.on('disconnect', async () => {
            // delete Users[socket.id];
            await Users.deleteOne({ id: socket.id })
        });

    })
}