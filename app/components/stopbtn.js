import React, { Component } from 'react';

export default class Stopbtn extends Component {

  render() {
              let self = this;
    return (
        <button onClick={this.props.onPlay}>the world</button>
    );
  }
}

