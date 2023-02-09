import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Grid, Board, getChess } from "../../components/board";
import { Game } from "../../types/game";
import ISocket from "../../action/socket";

interface GameRoomProps {
	player: {
		name?: string;
		id: string;
	};
}

export const GameRoom = () => {
	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const [game, setGame] = useState<Game>();

	const { player }: GameRoomProps = location.state
		? (location.state as GameRoomProps)
		: { player: { id: "" } };

	ISocket.getInstance().on("game", ({ game }) => {
		if (!game) navigate("/", { state: { player } });
		setGame(game);
	});

	useEffect(() => {
		if (!game) {
			if (player.id !== "") {
				ISocket.getInstance().off("list");
				ISocket.getInstance().emit("join", {
					pid: player.id,
					room: id,
				});
			} else {
				navigate("/");
			}
		}
	}, [game, player, id, navigate]);

	const play = (x: number, y: number) => {
		if (checkPlaying() && !game?.gameover) {
			ISocket.getInstance().emit("play", {
				room: game?.id,
				player: player,
				x: x,
				y: y,
			});
			return checkPlaying() && !game?.gameover;
		}
	};

	const restart = () => {
		ISocket.getInstance().emit("restart", {
			room: game?.id,
			pid: player.id,
		});
	};

	const checkRestart = (player: string): boolean => {
		if (!game || !game.restartWaitList) return false
		console.log(game)
		return game.restartWaitList.includes(player);
	};

	function checkPlaying(p?: string): boolean {
		p = p !== undefined ? p : player.id;
		if (!game?.players[1]) return false;
		return p === game?.players[game.firstPlayerPlaying ? 0 : 1];
	}

	return (
		<>
			<div style={{ margin: "3rem auto 0", width: "fit-content" }}>
				Players: <br />
				<table
					style={{
						margin: "auto",
						paddingLeft: "2.5rem",
						borderCollapse: "collapse",
					}}
				>
					<tbody>
						{game?.players.map((p: string) => (
							<tr
								key={p}
								style={
									p === player.id
										? { border: "1px black solid" }
										: {}
								}
							>
								<td key={"name"}>
									<span>{p || "waiting for opponent"}</span>
								</td>
								<td key={"chess"}>
									<Grid chess={getChess(game, p)} />
								</td>
								<td key={`playing`} style={{ width: "4rem" }}>
									<span>
										{checkPlaying(p) && !game.gameover && (
											<span>Playing</span>
										)}
										{checkPlaying(p) && game.gameover && (
											<span style={checkRestart(p) ? {marginRight: "1rem"}: {}}>Winner</span>
										)}
										{checkRestart(p) && (
											<span>Restart</span>
										)}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Board game={game} play={play} />
			<div style={{ margin: "3rem auto 0", width: "fit-content" }}>
				<div style={{ display: "inline-flex" }}>
					<button onClick={restart} disabled={!game?.gameover}>
						Restart
					</button>
				</div>
			</div>
		</>
	);
};
