const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Users = require('./models/Users');
const Chats = require('./models/Chats');

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
            const {err, data} = verifyJWTToken(authToken);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            } else {
                login = true;
                token = data.token;
            }
            if (login) {
                console.log(await countToken(token))
                if (await countToken(token) == 1) {

                    const friendId = await getIdByToken(token);
                    await add(socket.id, token, login);
                    await updateFreind(socket.id, friendId);

                    // send them status online
                    io.to(socket.id).emit('status', 'online');
                    io.to(friendId).emit('status', 'online');

                } else if (await countToken(token) == 0) {
                    await add(socket.id, token, login);
                }
            }
        })

        socket.on('massage', async (massage, dataType, id) => {
            const {err, data} = verifyJWTToken(id);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            }
            if (await getStatus(socket.id)) {
                if (dataType == 'string') {
                    massage = HTMLSPACIALCHAR(massage);
                }

                const freind = await getFreindByToken(data.token, socket.id);
                io.to(freind).emit('recive', { massage: massage, dataType: dataType, to: data.token});
            }
        })

        socket.on('reqVideoCall', async (id, callback) => {
            const {err, data} = verifyJWTToken(id);
                if (err) {
                    return socket.emit('error', 'Somthing Went Wrong');
                }
                const freind = await getFreindByToken(data.token, socket.id);

                io.timeout(10000).to(freind).emit('reqVideoCall', (err, res) => {
                    if (err) callback('err');
                    if (res[0] == true) callback(true);
                    else if (res[0] == false) callback(false);
                })
        })

        socket.on('cancleVideoCall', async (id) => {
            console.log('req come here');
            const { data, err } = verifyJWTToken(id);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            } else {
                const freind = await getFreindByToken(data.token, socket.id);
                io.to(freind).emit('cancleVideoCall');
            }
        })

        socket.on('disconnectVideoCall', async (id) => {

            const { data, err } = verifyJWTToken(id);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            } else {
                const freind = await getFreindByToken(data.token, socket.id);
                io.to(freind).emit('disconnectVideoCall');
            }
        })
        socket.on('sendPeerConnectionId', async  (id, peerToken) => {
            const {data, err} = verifyJWTToken(id);
                if (err) {
                    return socket.emit('error', 'Somthing Went Wrong');
                }
                const freind = await getFreindByToken(data.token, socket.id);
                io.to(freind).emit('sendPeerConnectionId', peerToken);
        });

        socket.on('status', async (status, id) => {
            const {data, err} = verifyJWTToken(id);
            if(err){
                return socket.emit('error', 'Somthing Went Wrong');
            }
            const freind = await getFreindByToken(data.token, socket.id);
            io.to(freind).emit('status', status);
        })

        socket.on('disconnect', async () => {
            try {
                const freindId = await getFreindId(socket.id);
                updateOnlineStatus(freindId);
                io.to(freindId).emit('status', 'offline');

            } catch (e) {
                console.log('error occur at discconected area', e)
            }
            deleteUser(socket.id);
        });

    })
}
function verifyJWTToken(token) {
    try {

        var decoded = jwt.verify(token, SIGN);
        return { data: decoded }

    } catch (err) {

        return { err: err };
    }
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
    if (data) {
        return data.friend;
    }
}
async function getFreindByToken(token, id) {
    const data = await Users.findOne({ token: token, id: { $ne: id } });
    if (data) {
        return data.id;
    }
}
async function getIdByToken(token) {
    const data = await Users.findOne({ token: token });
    return data.id;
}
async function updateOnlineStatus(id) {
    await Users.updateOne({ id: id }, { $set: { online: false } });
}
async function deleteUser(id) {
    await Users.deleteOne({ id: id });
}
async function getStatus(id) {
    const data = await Users.findOne({ id: id });
    if (data)
        return data.online;
}
function HTMLSPACIALCHAR(massage) {
    return massage.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
}