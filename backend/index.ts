import express from "express";
import bodyParser from "body-parser";

import { Server } from "socket.io";
import UserRoutes from "./routes/userRoutes";
import { SocketMethod } from "./socket";
import GameRoutes from "./routes/gameRoutes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

new UserRoutes(app);
new GameRoutes(app);
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
	socket.on("get-list", () => {
		SocketMethod.updateList(io);
	});

	socket.on("join", ( params) => {
		SocketMethod.joinGame(socket, io, params.pid, params.room);
	});

	socket.on(
		"play",
		(params: { room: string; player: string; x: number; y: number }) => {
			SocketMethod.play(io, params);
		}
	);

	socket.on("restart", ({ room, pid }: { room: string; pid: string }) => {
		SocketMethod.restart(io, room, pid);
	});
});
