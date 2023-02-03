import { Component } from "react";
import Board from "../components/board";
import Grid from "../components/grid";
import s from "../components/board.module.css";
import io from "socket.io-client";
import { Button, Label, Input } from "reactstrap";

const ENDPOINT = "http://localhost:5000";

export default class Game extends Component {
    state = {
        socket: null,
        game: null,
        inputs: {
            roomId: "",
        },
        message: [],
    };

    constructor(props) {
        super(props);
        this.createGame = this.createGame.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.checkPlaying = this.checkPlaying.bind(this);
        this.checkWinner = this.checkWinner.bind(this);
        this.restart = this.restart.bind(this);
    }

    createGame() {
        let socket = this.initSocket();
        socket.emit("create", { pid: this.props.player.id });
        this.setState({ socket });
    }

    joinGame() {
        let socket = this.initSocket();
        socket.emit("join", {
            pid: this.props.player.id,
            room: this.state.inputs.roomId,
        });
        this.setState({ socket });
    }

    initSocket() {
        let socket = io(ENDPOINT);
        socket.on("game", ({ game }) => {
            this.setState({ game: game });
        });
        return socket;
    }

    checkWinner(player) {
        player = player !== undefined ? player : this.props.player;
        const { game } = this.state;
        return (
            player.id === game.players[game.firstPlayerPlaying ? 0 : 1].id &&
            game.gameover
        );
    }

    setInputs(key, value) {
        var { inputs } = this.state;
        inputs[key] = value;
        this.setState({ inputs });
    }

    checkPlaying(player) {
        player = player !== undefined ? player : this.props.player;
        const { game } = this.state;
        return (
            player.id === game.players[game.firstPlayerPlaying ? 0 : 1].id &&
            !game.gameover
        );
    }

    checkRestart = (player) => {
        
    }

    gameReady() {
        const { game } = this.state;
        return game.players[1] != null;
    }

    restart() {
        this.state.socket.emit("restart", { room: this.state.game.id, pid: this.props.player.id });
    }

    renderMain() {
        const getChess = (player) => {
            if (player !== undefined) {
                const { game } = this.state;
                const chess = { 0: s.white, 1: s.black };
                return chess[game.players.findIndex((x) => x.id === player.id)];
            }
        };
        return (
            <>
                <div>
                    Players: <br />
                    <table
                        style={{
                            margin: "auto",
                            paddingLeft: "2.5rem",
                            borderCollapse: "collapse",
                        }}
                    >
                        {this.state.game.players.map((p) => (
                            <tr
                                key={p.id}
                                style={
                                    p.id === this.props.player.id
                                        ? { border: "1px black solid" }
                                        : {}
                                }
                            >
                                <td key={"name"}>
                                    <span>{p.name}</span>
                                </td>
                                <td key={"chess"}>
                                    <Grid chess={getChess(p)} />
                                </td>
                                <td key={`playing`} style={{ width: "4rem" }}>
                                    <span>
                                        {this.checkPlaying(p) && "Playing"}
                                        {this.checkWinner(p) && "Winner"}
                                        {this.checkRestart(p) && "Waiting For New Game"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
                <Board
                    player={this.props.player}
                    game={this.state.game}
                    socket={this.state.socket}
                    playing={this.checkPlaying}
                />
                <div style={{ display: "inline-flex" }}>
                    <button
                        onClick={this.restart}
                        disabled={!this.state.game.gameover}
                    >
                        Restart
                    </button>
                </div>
            </>
        );
    }

    renderNewGame() {
        return (
            <div style={{ margin: "10rem auto", width: "fit-content" }}>
                <Label style={{ marginRight: "1rem" }}>Owner</Label>
                <Input disabled value={this.props.player.name} />
                <br />
                <Button style={{ width: "100%" }} onClick={this.createGame}>
                    Create Game
                </Button>
                <br />
                <br />
                Or Join a room: <br />
                <Label style={{ marginRight: "1rem" }}>Room Id:</Label>
                <Input
                    onChange={(e) => {
                        this.setInputs("roomId", e.target.value);
                    }}
                    value={this.state.inputs.roomId}
                ></Input>
                <Button
                    style={{ width: "100%" }}
                    onClick={() => this.joinGame()}
                >
                    Join Room
                </Button>
            </div>
        );
    }

    renderWaiting() {
        return (
            <div style={{ margin: "10rem auto", width: "fit-content" }}>
                {this.state.game.id}
            </div>
        );
    }

    render() {
        const { game } = this.state;
        if (game === null) {
            return this.renderNewGame();
        }
        if (this.gameReady()) return this.renderMain();
        return this.renderWaiting();
    }
}
