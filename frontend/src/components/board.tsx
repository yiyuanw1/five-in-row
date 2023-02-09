import React from "react";
import { Game } from "../types/game";
import s from "./board.module.css";

interface BoardProps{
	play: Function
	game?: Game
}

export const Board = (props: BoardProps) => {

  const {play, game} = props
	return (
		<>
			<div className={s.board}>
				<div className={s.main}>
					{[...Array(19)].map((_, x) => (
						<div key={`m${x}`} style={{ display: "flex" }}>
							{[...Array(19)].map((_, y) => {
								const grid = game?.board[x][y]
								const chess = (grid && grid !== '') ? getChess(game, grid) : ''
								return (
									<Grid
										key={`m${x}${y}`}
										onclick={() => play(x, y)}
										chess={chess}
									/>
								);
							})}
						</div>
					))}
				</div>
				<div className={s.background}>
					{[...Array(18)].map((_, i) => (
						<div key={`b${i}`} style={{ display: "flex" }}>
							{[...Array(18)].map((_, j) => {
								return <Grid key={`m${i}${j}`} chess=""/>;
							})}
						</div>
					))}
				</div>
			</div>
		</>
	);
}

interface GridProps{
	chess: string
	onclick?: Function
}

export const Grid = (props: GridProps) => {

	const {chess, onclick} = props

  const play = (ev: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
		let target = ev.target as HTMLElement
    if (!target.classList.contains(s.chess)) {
      target.style.width = "1rem";
      target.style.height = "1rem";
      target.style.margin = "0";
    }
  }

  var classes = `${s.grid}`
  let styles = {}
  if(chess) {
    classes += ` ${chess} ${s.chess}`
    styles = {
      width: "1rem",
      height: "1rem",
      margin: "0"
    }
  }
  
  return (
    <div
      className={classes}
      style={styles}
      onClick={(ev) => {
        if (onclick && onclick()) play(ev);
      }}
    ></div>
  );
}

export function getChess(game: Game | undefined, pid: string) {
	const chess = [s.white, s.black]
	const index = game?.players.findIndex((x: string) => x === pid)
	if (index === undefined) return ''
	return chess[index]
}