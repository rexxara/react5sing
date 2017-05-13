import React, { Component } from 'react';
import SingSdk from '5sing-sdk';

export default class Head extends Component {
    constructor() {
        super();
        this.state = {
            avatarsrc: null,
            name: null
        }
    }
    componentWillMount() {
        var avatarsrc;
        var name;
        console.log(this.props.myid)
        SingSdk.getUserInfo({
            userId: this.props.myid
        }, function (res) {
            console.log(res)
            avatarsrc = res.data.I;
            name = res.data.NN;
        }, function (err) {
            console.log(error);
        }).then(()=>{
            this.setState({avatarsrc: avatarsrc});
            this.setState({name: name});
        console.log(this.state)})

    }
    render() {
        let self = this;
        return (
            <div>
                <img className="avatar" src={this.state.avatarsrc} />
                <span className="userid">{this.state.name}</span>
                <div className="loginout" onClick={this.props.logout}>登出</div>
            </div>
        );
    }
}

