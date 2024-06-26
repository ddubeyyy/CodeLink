require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL)
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { Server } = require('socket.io');
const httpsServer = require('http').createServer(app);
const socketRoom = require('./Socket/socketRoom');
const compression = require('compression');

app.use(morgan('tiny'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const corsOption = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};
app.use(cors(corsOption));
app.use(helmet());
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
    }),
);
app.use(compression());

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('home');
});

const home = require('./Routes/home');
const user = require('./Routes/user');
const rooms = require('./Routes/rooms');
const codebox = require('./Routes/codebox');

app.use('/api/v1', home);
app.use('/api/v1', user);
app.use('/api/v1', rooms);
app.use('/api/v1', codebox);

const io = new Server(httpsServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
        credentials: true,
    },
});
socketRoom(io);

exports.app = app;
exports.httpsServer = httpsServer;
