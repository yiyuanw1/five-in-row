import { Component } from "react";
import { Label, Input, Button, Form } from "reactstrap";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  state = {
    name: "",
  };

  login(e) {
    e.preventDefault()
    fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: this.state.name }),
    }).then((resp) => {
      resp.json().then((result) => {
        this.props.setPlayer(result)
      })
    });
  }

  render() {
    return (
      <div style={{ margin: "10rem auto", width: "fit-content" }}>
        <Form>
          <Label style={{ marginRight: "1rem" }}>Name</Label>
          <Input
            value={this.state.name}
            onChange={(ev) => {
              this.setState({ name: ev.target.value });
            }}
          ></Input>
          <br />
          <Button style={{ width: "100%" }} onClick={this.login}>
            Login
          </Button>
        </Form>
      </div>
    );
  }
}
