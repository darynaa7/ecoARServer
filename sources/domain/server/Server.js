const express = require('express');

const authRouter = require('../authentification/AuthRouter');
const fileRouter = require('../file/FileRouter');
require('dotenv').config();

const db = require('../../data/DBase');
const cors = require("cors");
const {Server} = require("socket.io")
const cookieParser= require("cookie-parser");

require('../../model/dataModels/User');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
    exposedHeaders: ['Content-Length', 'Authorization'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    serveClient: false
};

let serverPort = process.env.PORT || 3000;
let mainSocket;

console.log("туткай")
async function startDb(serverPort) {
    try {
        console.log("туткай2")

        await db.authenticate();
        await db.sync();
        console.log("туткай3")

        const app = express();
        const httpServer = require("http").Server(app)
        const io = new Server(httpServer, {
            cors: {
                origin: "*"
            }
        });

        httpServer.listen(serverPort, () => {
            console.log(`Server started on port ${serverPort}`);
        });

        app.get('/', (req, res) => {
            res.json({
                hello: "world"
            })
        });

        app.use(cors(corsOptions));
        app.use(cookieParser());
        app.use(express.json());

        app.use("/auth", authRouter);
        app.use("/file", fileRouter)

        io.on("connection", (socket) => {
            module.exports.mainSocket = socket

            socket.on("worker_response", (data) => {
                console.log(data)
            })

            socket.on("worker_request", (data) => {

            })

            socket.on("balancer_response", (data) => {

            })
        })

        io.on("connect_error", (e) => {
            console.log(e.message)
        })
    } catch (e) {
        process.exit(1);
    }
}

const setServerPort = (newPort) => {
    serverPort = newPort
}

module.exports = {
    mainSocket,
    serverPort,
    startDb,
    setServerPort
}