
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import SingSdk from '5sing-sdk';
import fs from 'fs';
import Main from './testmod';

export default class Home extends Component {

  // getMySongCollections() {
  //   console.log("getMySongCollections")
  //   SingSdk.getMySongCollections({
  //     sign: this.state.sign
  //   }, (res) => {
  //     console.log(res)

  //   }, (err) => { console.log(err) });
  // }
  // getMySongs() {
  //   console.log('getMySongs');
  //   SingSdk.getMySongs({
  //     userId: this.state.userId
  //   }, (res) => {
  //     console.log(res)
  //     fs.writeFileSync(`./songList.json`, JSON.stringify(res), 'utf8');
  //   }, (err) => { console.log(err) });
  // }
  render() {
    return (
        <Main/>
    );
  }
}

