import React, { useState } from "react";
import { HomePage } from "./game/index";
import {useLocation} from 'react-router-dom'
import Login from "./login";

const Main = () => {
	const [player, setPlayer] = useState()
	const location = useLocation()

	if (location.state !== null && !player) setPlayer(location.state.player)

	if (!player) return <Login setPlayer={setPlayer}/>

	return <HomePage player={player}/>
}

export default Main