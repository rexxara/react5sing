import React, { Component } from 'react';

export default class Notlogin extends Component {

  render() {
    return (
        <div>
        < img className="tombAvatar avatar" />
        <span className="tombId userid">请登录</span>
        <div className="loginout" onClick={this.props.popLogin}>登陆</div>
        </div>
    )
  }
}

