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

module.exports = (io) => {

    io.on('connection', (socket) => {

        socket.on('join', async (authToken) => {
            let token;
            let login = false;
            jwt.verify(authToken, SIGN, (err, data) => {
                if (err) {
                    return socket.emit('error', 'Somthing Went Wrong');
                } else {
                    login = true;
                    token = data.token;
                }
            })
            if (login) {
                console.log(await countToken(token))
                if (await countToken(token) == 1) {

                    const friendId = await getIdByToken(token);
                    await add(socket.id, token, login);
                    await updateFreind(socket.id, friendId);

                    // send them status online
                    io.to(socket.id).emit('status', 'online');
                    io.to(friendId).emit('status', 'online');

                } else { //if (await countToken(token) == 0) 
                    await add(socket.id, token, login);
                }
            }

        })

        socket.on('massage', (massage, id) => {
            jwt.verify(id, SIGN, async (err, data) => {
                if(err){
                    return socket.emit('error', 'Somthing Went Wrong');
                }
                if (await getStatus(socket.id)) {
                    const freind = await getFreindId(socket.id);
                    console.log(freind);
                    io.to(freind).emit('recive', massage);
                }
            })
        })

        socket.on('status', async (status)=>{
            const friendId = await getFreindId(socket.id);
            io.to(friendId).emit('status', status);
        })
        socket.on('disconnect', async () => {
            try{
                const freindId = await getFreindId(socket.id);
                updateOnlineStatus(freindId);
                io.to(freindId).emit('status', 'offline');
            }catch(e){}
            deleteUser(socket.id);
        });

        function sendStatusOnline(id1, id2){
            
        }
    })
}
async function add(id, token, auth) {
    await new Users({
        _id: new mongoose.Types.ObjectId(),
        id: id,
        token: token,
        auth: auth,
        friend: '',
        online: false,
    }).save();
}
async function countToken(token) {
    return await Users.find({ token: token }).count();
}
async function updateFreind(id1, id2) {
    await Users.updateOne({ id: id1 }, { $set: { friend: id2, online: true } })
    await Users.updateOne({ id: id2 }, { $set: { friend: id1, online: true } })
}
async function getFreindId(id) {
    const data = await Users.findOne({ id: id });
    if(data){
        return data.friend;
    }
}
async function getIdByToken(token) {
    const data = await Users.findOne({ token: token });
    return data.id;
}
async function updateOnlineStatus(id){
    await Users.updateOne({id: id}, {$set: {online: false}});
}
async function deleteUser(id){
    await Users.deleteOne({id: id});
}
async function getStatus(id){
    const data = await Users.findOne({id:id});
    return data.online;
}
