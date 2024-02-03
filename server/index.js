const express = require('express');
var cors = require('cors');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')({ cors: { origin: '*' }, maxHttpBufferSize: 1e8 });
const dotenv = require('dotenv');

const postRoute = require('./router/post')
const chatRoute = require('./router/chat')
const liveRoute = require('./router/live')
require('./soket')(io);


app.use(cors({ origin: '*' }));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, 'uploads')));

///////////////////////////////////////////////////////////////////////////

app.use('/live', liveRoute);
app.use('/post', postRoute);
app.use('/chat', chatRoute);

///////////////////////////////////////////////////////////////////////////

server.listen(3000, () => {
    console.log('server started on', 3000)
})
io.attach(server);