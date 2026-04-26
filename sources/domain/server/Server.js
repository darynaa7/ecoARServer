const express = require('express');

require('dotenv').config();
const authRouter = require('../authentification/AuthRouter');
const fileRouter = require('../file/FileRouter');
const environmentRouter = require('../environment/EnvironmentDataRouter');
const mapRouter = require('../mapData/MapRouter');

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

let mainSocket;
let serverPort = process.env.PORT || 3000;

async function startDb(serverPort) {
    try {
        await db.authenticate();
        await db.sync();

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
        app.use("/environment",  environmentRouter);
        app.use("/map", mapRouter)


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
        console.error("DB ERROR:", e);
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