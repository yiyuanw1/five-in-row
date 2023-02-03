import express from "express";
import bodyParser from "body-parser";

import { Server, Socket } from "socket.io";
import UserRoutes from "./routes/userRoutes";
import { Game, GamePool } from "./model/game";
import { SocketMethod } from "./socket";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

new UserRoutes(app);
const server = app.listen(PORT, () => {
    console.log(
        `%cServer running on PORT ${PORT}...`,
        "color: yellow; font-weight: bold"
    );
});

const io: Server = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    
    socket.on("create", ({pid}:{pid:string}) => {
        SocketMethod.createGame(socket, pid)
    })

    socket.on("join", ({pid, room}: {pid: string; room: number}) => {
        SocketMethod.joinGame(socket, io, pid, room)
    })

    socket.on("play",(params: { room: number; player: string; x: number; y: number }) => {
        SocketMethod.play(io, params)
    })

    socket.on("restart", ({room, pid}:{room: number; pid: string}) => {
        SocketMethod.restart(io, room, pid)
    })
});
