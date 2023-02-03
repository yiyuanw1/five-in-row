import React, { Component } from "react";
import s from "./board.module.css";
import Grid from "./grid";

class Board extends Component {
  play(x, y) {
    if (this.props.playing()) {
      this.props.socket.emit("play", {
        room: this.props.game.id,
        player: this.props.player.id,
        x: x,
        y: y,
      });
      return this.props.playing();
    }
  }

  getChess(x, y) {
    const { game } = this.props;
    const chess = { 0: s.white, 1: s.black };
    if (game !== undefined) {
      const grid = game.board[x][y];
      let c =
        grid === '' ? "" : chess[game.players.findIndex((x) => x.id === grid)];
      return c;
    }
  }

  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
    this.getChess = this.getChess.bind(this);
  }

  render() {
    return (
      <>
        <div className={s.board}>
          <div className={s.main}>
            {[...Array(19)].map((_, x) => (
              <div key={`m${x}`} style={{ display: "flex" }}>
                {[...Array(19)].map((_, y) => {
                  return (
                    <Grid
                      key={`m${x}${y}`}
                      onclick={() => this.play(x, y)}
                      chess={this.getChess(x,y)}
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
                  return <Grid key={`b${i}${j}`} chess=""/>;
                })}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default Board;
