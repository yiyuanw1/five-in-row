import { Server, Socket } from "socket.io";
import { Game, GamePool } from "../model/game";

export class SocketMethod {
	static updateList(io: Server) {
		let list = GamePool.map((game) => {
			const { id, players } = game;
			if (!players[1]) return { id, players };
		});
		io.emit("list", { list });
	}

	static joinGame(socket: Socket, io: Server, pid: string, room: string) {
		let game: Game = GamePool.find(room);

		console.log(`Player ${pid} joining `);
		if (game === undefined) {
			socket.emit("game", {})
			return;
		}

		if (game.players.includes(pid) || game.addPlayer(pid)) {
			socket.join(`${room}`)
			io.in(`${room}`).emit("game", {game})
			if (!game.players[1]) SocketMethod.updateList(io)
			return;
		}

	}

	static play(
		io: Server,
		params: { room: string; player: string; x: number; y: number }
	) {
		const { room, x, y } = params;
		let game = GamePool.find(room);
		if (game !== undefined) {
			if (game.play({ x, y })) {
				if (!game.isEnd()) game.takeTurn();
			}
			SocketMethod.updateGame(io, game);
		}
	}

	static restart(io: Server, room: string, pid: string) {
		let game = GamePool.find(room);
		if (game !== undefined) {
			game.restart(pid);
			SocketMethod.updateGame(io, game);
		}
	}

	static updateGame(io: Server, game: Game) {
		io.in(`${game.id}`).emit("game", {
			game,
		});
	}
}
