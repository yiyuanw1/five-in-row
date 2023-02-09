import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages";
import { GameRoom } from "./pages/game/[id]";
import React from "react";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Main />} />
				<Route path="/game/:id" element={<GameRoom />} />
			</Routes>
		</Router>
	);
}

export default App;
