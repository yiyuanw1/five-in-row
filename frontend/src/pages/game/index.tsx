import React, { useEffect, useState } from "react";
import { Button, Label, Input, Table } from "reactstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "./game.module.css";
import { Room } from "../../types/game";
import ISocket from "../../action/socket";

interface GameProps {
	player: { id: string; name: string };
}

export const HomePage = (props: GameProps) => {
	
	const location = useLocation();
	const { player } = props || location.state as GameProps;
	const [list, setList] = useState<Room[]>();
	const navigate = useNavigate();

	useEffect(() => {
		ISocket.getInstance().on("list", ({ list }: { list: Room[] }) => {
			setList(list);
		});

		if (!list) ISocket.getInstance().emit("get-list");
	}, [list]);

	useEffect(() => {
		fetch("/check", {
			method: "POST"
			, headers: {"Content-Type": "application/json"}
			, credentials: "include",
			body: JSON.stringify({id: player.id})
		}).then(( resp: Response) => resp.json().then((res: {exist: boolean})=> {
			if (!res.exist) navigate("/")
		}))
	}, [player, navigate])

	const createGame = () => {
		fetch("/game/create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ pid: player.id }),
		}).then((resp) =>
			resp.json().then((res: { id: number }) => {
				// go to new game room
				navigate(`/game/${res.id}`, { state: { player } });
			})
		);
	};

	return (
		<>
			<div style={{ margin: "10rem auto 0", width: "fit-content" }}>
				<Label style={{ marginRight: "1rem" }}>Player</Label>
				<Input disabled value={player.name} />
				<br />
				<Button style={{ width: "100%" }} onClick={createGame}>
					Create Game
				</Button>
			</div>
			<br />
			<br />
			{list && list.length > 0 && (
				<Table style={{ margin: "auto", width: "fit-content" }}>
					<caption style={{ width: "max-content", margin: "auto" }}>
						Or join a room:
					</caption>
					<thead></thead>
					<tbody>
						{list?.map(
							(room: { id: number; players: string[] }) =>
								room && (
									<tr key={room.id}>
										<td>{room.players[0]}</td>
										<td>
											<Link
												to={`/game/${room.id}`}
												state={{ player }}
											>
												<Button
													className={style.button}
												>
													Join
												</Button>
											</Link>
										</td>
									</tr>
								)
						)}
					</tbody>
				</Table>
			)}
		</>
	);
};
