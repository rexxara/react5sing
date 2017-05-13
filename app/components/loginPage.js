import React, { Component } from 'react';
import SingSdk from '5sing-sdk';
import fs from 'fs';
export default class LoginPage extends Component {
    toggle(){
        this.refs.login.classList.toggle("none");
    }
      login() {
    var id = this.refs.id.value;
    var pw = this.refs.pw.value;
    SingSdk.login({
      username: id,
      password: pw
    }, (res) => {
        var resstate={
            "userId":res.userId,
            "sign":res.sign
        }
        this.props.login(resstate)
      fs.writeFileSync(`./userdata.json`, JSON.stringify(resstate), 'utf8');
      console.log('res', res)
    }, (err) => {
      console.log(err)
    })
  }
  render() {
              let self = this;
    return (
        <div ref="login" className="none">
        <h4 className="loginTittle">登陆</h4>
        <input className="loginInput" type="text" placeholder="用户名" ref="id"></input><br></br>

        <input className="loginInput" type="password" placeholder="密码" ref="pw"></input>
        <br></br>
          <div className="confirmlogin" onClick={this.login.bind(this)} >确认登陆</div>
          </div>
    );
  }
}