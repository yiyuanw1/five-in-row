import React, { useState } from "react";
import { Label, Input, Button, Form } from "reactstrap";

const Login = (props: { setPlayer: Function }) => {
	const [name, setName] = useState("");

	const login = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		fetch("/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ name }),
		}).then((resp) => {
			resp.json().then((result) => {
				props.setPlayer(result);
			});
		});
	};

	return (
		<div style={{ margin: "10rem auto", width: "fit-content" }}>
			<Form>
				<Label style={{ marginRight: "1rem" }}>Name</Label>
				<Input
					value={name}
					onChange={(ev) => {
						setName(ev.target.value);
					}}
				></Input>
				<br />
				<Button style={{ width: "100%" }} onClick={login}>
					Login
				</Button>
			</Form>
		</div>
	);
};

export default Login