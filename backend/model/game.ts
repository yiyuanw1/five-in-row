import { Server, Socket } from "socket.io";
import { SocketMethod } from "../socket";
import { Player, PlayerPool } from "./player";

const MAX_PLAYER = 2;

export class Game {
    id: number;
    players: Player[];
    plays: { [pid: string]: { x: number; y: number }[] };
    board: string[][];
    firstPlayerPlaying: boolean;
    time: Date;
    gameover: boolean = false;
    restartWaitList: Set<string>;

    constructor(pid: string) {
        let player = PlayerPool.filter((e) => e.id === pid)[0];
        this.players = Array(MAX_PLAYER);
        this.players[0] = player;
        this.board = Array(19)
            .fill([])
            .map(() => Array(19).fill(""));
        this.id = this.generateUUID();
        this.time = new Date();
        this.firstPlayerPlaying = true;
        this.plays = {};
        this.plays[pid] = [];

        this.restartWaitList = new Set();

        GamePool.push(this);
    }

    generateUUID(): number {
        return GamePool.length;
    }

    addPlayer(pid: string) {
        let player = PlayerPool.filter((e) => e.id === pid)[0];
        if (!this.players[1]) {
            this.players[1] = player;
            this.plays[pid] = [];
            return true;
        }
        return false;
    }

    // play a chess on the board and store the output
    play(coor: { x: number; y: number }) {
        if (this.board[coor.x][coor.y] === "") {
            this.board[coor.x][coor.y] = this.getCurrentPlayer().id;
            this.plays[this.getCurrentPlayer().id].push(coor);
            return true;
        }
        return false;
    }

    // check if the play can lead to the end of
    isEnd(): boolean {
        const coorAdd = <T extends { x: number; y: number }>(
            c1: T,
            c2: T,
            multiply: number
        ): { x: number; y: number } => {
            return { x: c1.x + multiply * c2.x, y: c1.y + multiply * c2.y };
        };
        let currentPlayerPlays = this.plays[this.getCurrentPlayer().id];
        const dirs: { x: number; y: number }[] = [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: -1 },
        ];
        let count: number = 0;
        let coor = currentPlayerPlays[currentPlayerPlays.length - 1];

        for (const dir of dirs) {
            count = 0;
            for (var i = -4; i < 5; i++) {
                if (count == 5) this.gameover = true;
                if (i == 0) {
                    count++;
                    continue;
                }
                if (
                    currentPlayerPlays.some((e) => {
                        let newCoor = coorAdd(coor, dir, i);
                        return e.x === newCoor.x && e.y === newCoor.y;
                    })
                ) {
                    count++;
                } else {
                    count = 0;
                }
            }
            if (count == 5) this.gameover = true;
        }

        return this.gameover;
    }

    getCurrentPlayer() {
        return this.firstPlayerPlaying ? this.players[0] : this.players[1];
    }

    takeTurn() {
        this.firstPlayerPlaying = !this.firstPlayerPlaying;
    }

    restart(pid: string) {
        if (!this.gameover) return ;

        this.restartWaitList.add(pid);

        if (this.restartWaitList.size !== 2) return ;

        Object.keys(this.plays).forEach((e) => {
            this.plays[e] = [];
        });

        this.board = Array(19)
            .fill([])
            .map(() => Array(19).fill(""));
        this.takeTurn();
        this.gameover = false;
    }
}

export var GamePool: Game[] = [];

export class GameError extends Error {
    constructor(token: string) {
        super();
        this.name = "GameError";
        this.message = `Error in ${token}`;
    }
}
