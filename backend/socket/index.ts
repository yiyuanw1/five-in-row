import { Server, Socket } from "socket.io";
import { Game, GamePool } from "../model/game";

export class SocketMethod {
    static createGame(socket: Socket, pid: string) {
        let game = new Game(pid);
        socket.join(`${game.id}`);
        socket.emit("game", { game });
    }

    static joinGame(socket: Socket, io: Server, pid: string, room: number) {
        let game = GamePool[room];
        if (game !== undefined) {
            if (game.addPlayer(pid)) {
                socket.join(`${room}`);
                io.in(`${room}`).emit("game", { game });
            }
        }
    }

    static play(io: Server, params: { room: number; player: string; x: number; y: number }) {
      const { room, x, y } = params;
      let game = GamePool[room];
        if (game !== undefined) {
            if (game.play({ x, y })) {
                if (!game.isEnd()) game.takeTurn();
            }
            SocketMethod.updateGame(io, game);
        }
    }

    static restart(io: Server, room: number, pid: string){
      let game = GamePool[room]
      if(game !== undefined)
      {
        game.restart(pid)
        SocketMethod.updateGame(io, game)
      }
    }

    static updateGame(io: Server, game: Game) {
        io.in(`${game.id}`).emit("game", {
            game,
        });
    }
}
