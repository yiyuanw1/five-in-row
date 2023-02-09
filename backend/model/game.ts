import { v4 as uid } from "uuid";
const MAX_PLAYER = 2;

export class Game {
	id: string;
	players: string[];
	plays: { [pid: string]: { x: number; y: number }[] };
	board: string[][];
	firstPlayerPlaying: boolean;
	time: Date;
	gameover: boolean = false;
	restartWaitList: string[];

	constructor(pid: string) {
		this.players = Array(MAX_PLAYER);
		this.players[0] = pid;
		this.board = Array(19)
			.fill([])
			.map(() => Array(19).fill(""));
		this.id = this.generateUUID();
		this.time = new Date();
		this.firstPlayerPlaying = true;
		this.plays = {};
		this.plays[pid] = [];

		this.restartWaitList = [];

		GamePool.push(this);
	}

	generateUUID(): string {
		let temp = uid();
		if (
			GamePool.filter((p) => {
				p.id === temp;
			}).length != 0
		) {
			return this.generateUUID();
		}
		return temp;
	}

	addPlayer(pid: string) {
		if (this.players.includes(pid)) return false;
		if (!this.players[1]) {
			this.players[1] = pid;
			this.plays[pid] = [];
			return true;
		}
		return false;
	}

	// play a chess on the board and store the output
	play(coor: { x: number; y: number }) {
		if (this.board[coor.x][coor.y] === "") {
			this.board[coor.x][coor.y] = this.getCurrentPlayer();
			this.plays[this.getCurrentPlayer()].push(coor);
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
		let currentPlayerPlays = this.plays[this.getCurrentPlayer()];
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
		if (!this.gameover) return;

		if (this.restartWaitList.includes(pid)) return;

		this.restartWaitList.push(pid);

		if (this.restartWaitList.length !== 2) return;

		Object.keys(this.plays).forEach((e) => {
			this.plays[e] = [];
		});

		this.board = Array(19)
			.fill([])
			.map(() => Array(19).fill(""));
		this.takeTurn();
		this.restartWaitList = [];
		this.gameover = false;
	}
}

class IGamePool{
    pool: Game[]
    constructor(){
        this.pool = []
    }

    push(game: Game){
        this.pool.push(game)
    }

    find(id: string): Game{
        return this.pool.filter(game => game.id === id)[0]
    }

    filter(predicate: (value: Game, index: number, array: Game[]) => unknown){
        return this.pool.filter(predicate)
    }

    map(callback: (value: Game, index: number, array: Game[]) => unknown){
        return this.pool.map(callback)
    }
}

export var GamePool: IGamePool = new IGamePool();

export class GameError extends Error {
	constructor(token: string) {
		super();
		this.name = "GameError";
		this.message = `Error in ${token}`;
	}
}
