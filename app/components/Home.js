
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import SingSdk from '5sing-sdk';
import fs from 'fs';
import Main from './testmod';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      userId: null,
      sign: null
    }
   // console.log(this.state)
  }


  getMySongCollections() {
    console.log("getMySongCollections")
    SingSdk.getMySongCollections({
      sign: this.state.sign
    }, (res) => {
      console.log(res)

    }, (err) => { console.log(err) });
  }
  getMySongs() {
    console.log('getMySongs');
    SingSdk.getMySongs({
      userId: this.state.userId
    }, (res) => {
      console.log(res)
      fs.writeFileSync(`./songList.json`, JSON.stringify(res), 'utf8');
    }, (err) => { console.log(err) });
  }
  componentWillMount() {
    this.state = JSON.parse(fs.readFileSync('./userdata.json', 'utf-8'));
    //console.log(this.state)
  }
  render() {
    return (
      <div>
        <Main data={this.state}/>

        <div className={styles.container} data-tid="container">
          <input type="button" name="getMySongCollections" onClick={this.getMySongCollections.bind(this)} value='获取我的收藏歌单'></input>
          <input type="button" name="getMySongs" onClick={this.getMySongs.bind(this)} value='获取我的收藏歌曲'></input>
        </div>
      </div>
    );
  }
}

