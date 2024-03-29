const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Users = require('./models/Users');
const ss = require('socket.io-stream');
const fs = require('fs');

dotenv.config();
const SIGN = process.env.JWT_SECRET_KEY;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL).then(() => {
    console.log('Database Connected');
    //todo: remove in production

    deleteAllUser();
});

module.exports = (io) => {

    io.on('connection', (socket) => {

        ss(socket).on('file', async (stream, obj, callback) => {
            let stream2 = ss.createStream();
            const { err, data } = verifyJWTToken(obj.token);
            if (err) return socket.emit('error', 'Somthing Went Wrong');
            try {
                const freind = await getFreindByToken(data.token, socket.id);
                obj.token = data.token;
                // io.sockets.sockets.get(freind)
                ss(io.sockets.sockets.get(freind)).emit('massage', stream2, obj, callback);
                stream.pipe(stream2);
            } catch (e) {
                console.log(e);
                return socket.emit('error', 'Somthing Went Wrong');
            }
        });

        socket.on('join', async (authToken) => {
            console.log('user join', socket.id);
            let token;
            let login = false;
            const { err, data } = verifyJWTToken(authToken);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            } else {
                login = true;
                token = data.token;
            }
            if (login) {
                const total_paticipate = await countToken(token);
                // console.log(total_paticipate, token, login);

                if (total_paticipate == 1) {

                    const friendId = await getIdByToken(token);

                    await add(socket.id, token, login);
                    await updateFreind(socket.id, friendId);

                    // send them status online
                    io.to(socket.id).emit('status', { status: 'online', to: data.token });
                    io.to(friendId).emit('status', { status: 'online', to: data.token });

                } else if (total_paticipate == 0) {
                    await add(socket.id, token, login);
                    io.to(socket.id).emit('status', { status: 'offline', to: data.token });
                }
            }
        })

        socket.on('massage', async (authToken, obj, callback) => {
            const { err, data } = verifyJWTToken(authToken);
            if (err) {
                callback({ id: obj.id, status: 'failed' });
                return socket.emit('error', 'Somthing Went Wrong');
            }

            if (obj.dataType == 'string') {
                massage = HTMLSPACIALCHAR(massage);
            }
            try {
                const freind = await getFreindByToken(data.token, socket.id);
                callback({id: obj.id, status: 'sent' })
                io.timeout(20 * 60).to(freind).emit('recive', obj, data.token, );

            } catch (e) {
                console.log('erro occure', e);
                callback({ id: obj.id, status: 'failed' });
                return socket.emit('error', 'Somthing Went Wrong');
            }
        })

        socket.on('deleteForEveryOne', async (token, obj, callback) => {
            const { err, data } = verifyJWTToken(token);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            }
            try {
                const freind = await getFreindByToken(data.token, socket.id);
                io.timeout(20 * 60).to(freind).emit('deleteForEveryOne', { ...obj, to: data.token }, callback)
            } catch (e) {
                return socket.emit('error', 'Somthing Went Wrong');
            }
        })

        socket.on('edit', async (token, obj, callback) => {
            const { err, data } = verifyJWTToken(token);
            if (err) {
                callback({ id: obj.id, status: 'failed' });
                return socket.emit('error', 'Somthing Went Wrong');
            }
            try {
                const freind = await getFreindByToken(data.token, socket.id);
                obj.edited = true;
                callback({ id: obj.id, status: 'sent'});
                io.timeout(20 * 60).to(freind).emit('edit', obj, data.token);

            } catch (e) {
                console.log('erro occure', e);
                callback({ id: obj.id, status: 'failed' });
                return socket.emit('error', 'Somthing Went Wrong');
            }
        })

        socket.on('seen', async (authToken, obj) => {
            console.log('seen req here');
            const { err, data } = verifyJWTToken(authToken);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            }
            const freind = await getFreindByToken(data.token, socket.id);
            console.log('seen req here');
            io.to(freind).emit('seen', { id: obj.id, to: data.token });
        })

        //video call
        socket.on('reqVideoCall', async (id, callback) => {
            const { err, data } = verifyJWTToken(id);
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

        //audio call
        socket.on('reqAudioCall', async (id, callback) => {
            const { err, data } = verifyJWTToken(id);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            }
            const freind = await getFreindByToken(data.token, socket.id);

            // console.log('use responded', freind);
            io.timeout(10000).to(freind).emit('reqAudioCall', (err, res) => {
                if (err) callback('err');
                if (res[0] == true) callback(true);
                else if (res[0] == false) callback(false);
            })
        })

        socket.on('cancleAudioCall', async (id) => {
            const { data, err } = verifyJWTToken(id);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            } else {
                const freind = await getFreindByToken(data.token, socket.id);
                io.to(freind).emit('cancleAudioCall');
            }
        })

        socket.on('disconnectAudioCall', async (id) => {

            const { data, err } = verifyJWTToken(id);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            } else {
                const freind = await getFreindByToken(data.token, socket.id);
                io.to(freind).emit('disconnectAudioCall');
            }
        })

        //send peer connection id
        socket.on('sendPeerConnectionId', async (id, peerToken) => {
            const { data, err } = verifyJWTToken(id);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            }
            const freind = await getFreindByToken(data.token, socket.id);
            io.to(freind).emit('sendPeerConnectionId', peerToken);
        });

        socket.on('status', async (status, id) => {
            const { data, err } = verifyJWTToken(id);
            if (err) {
                return socket.emit('error', 'Somthing Went Wrong');
            }
            const freind = await getFreindByToken(data.token, socket.id);
            io.to(freind).emit('status', { status: status, to: data.token });
            // io.to(freind).emit('status', { status: status, to: data.token });
        })

        socket.on('disconnect', async () => {
            try {
                const freindId = await getFreindId(socket.id);
                const token = await getTokenById(socket.id);
                updateOnlineStatus(freindId);
                io.to(freindId).emit('status', { status: 'offline', to: token });

            } catch (e) {
                console.log('error occur at discconected area', e)
            }
            await deleteUser(socket.id);

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
async function getTokenById(id) {
    try {
        const data = await Users.findOne({ id: id })
        return data.token;
    } catch (e) {
        console.log(e);
    }
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
    try {
        const data = await Users.findOne({ token: token });
        return data.id;
    } catch (e) {
        console.log('error occur at getIdByToken', e);
        return false;
    }
}
async function updateOnlineStatus(id) {
    await Users.updateOne({ id: id }, { $set: { online: false } });
}
async function deleteUser(id) {
    await Users.deleteMany({ id: id });
}
async function getStatus(id) {
    const data = await Users.findOne({ id: id });
    if (data)
        return data.online;
}

function HTMLSPACIALCHAR(massage) {
    if (typeof massage == 'string') {
        return massage.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
    }
}
async function deleteAllUser() {
    await Users.deleteMany({});
}