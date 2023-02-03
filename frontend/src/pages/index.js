import { Component } from "react";
import Game from "./game";
import LoginPage from "./login";

export default class Main extends Component{

  state = {
    player: null,
  }

  setPlayer(player){
    this.setState({player})
  }
  
  constructor(props){
    super(props)
    this.setPlayer = this.setPlayer.bind(this)
  }

  render(){
    const {player} = this.state
    if (player == null) return <LoginPage setPlayer={this.setPlayer} />
    return <Game player={player}/>
  }
  
};
