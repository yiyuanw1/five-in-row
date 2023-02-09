export interface Player {
	id: string;
}

export interface Game {
	id: number;
	players: string[];
	firstPlayerPlaying: boolean;
	gameover: boolean;
	board: string[][];
	restartWaitList: string[]
}

export interface Room {
	id: number;
	players: string[];
}
