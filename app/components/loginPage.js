import React, { Component } from 'react';

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
      this.state.userId = res.userId;
      this.state.sign = res.sign;
      fs.writeFileSync(`./userdata.json`, JSON.stringify(this.state), 'utf8');
      console.log('info', this.state)
      console.log('res', res)
    }, (err) => {
      console.log(err)
    });
  }
  render() {
              let self = this;
    return (
        <h2 ref="login" className="none">登陆登录</h2>
          用户名：
        <input type="text" ref="id"></input><br></br>
          密码：
        <input type="password" ref="pw"></input>
          <input type="button" name="submit" onClick={this.login.bind(this)} value='确认登陆'></input>
    );
  }
}