import React, { Component } from "react";
import s from "./board.module.css";

class Grid extends Component {
  play(ev) {
    if (!ev.target.classList.contains(s.chess)) {
      ev.target.style.width = "1rem";
      ev.target.style.height = "1rem";
      ev.target.style.margin = "0";
    }
  }

  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
  }

  render() {
    var classes = `${s.grid}`
    let styles = {}
    if(this.props.chess) {
      classes += ` ${this.props.chess} ${s.chess}`
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
          if (this.props.onclick && this.props.onclick()) this.play(ev);
        }}
      ></div>
    );
  }
}

export default Grid;
