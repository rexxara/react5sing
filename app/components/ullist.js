import React, { Component } from 'react';
import fs from 'fs';
export default class Stopbtn extends Component {
    constructor() {
        super();
        this.state = {
            playList: [],
            pointArr: [],
        }
    }
    componentWillMount() {
        this.updateSongList();
    }
    evVpn(e) {
        console.log(e.target.parentNode.parentNode.dataset.songnum)
        this.props.changeSong(e.target.parentNode.parentNode.dataset.songnum);
    }
    updateSongList() {
        var res = JSON.parse(fs.readFileSync('./modyfiedSongList.json', 'utf-8'));
        this.state.playList = res.songs;
        for (let i = 0; i < res.songs.length; i++) {
            this.state.pointArr.push(i);
        }
    }
    render() {
        let self = this;
        return (
            <ul id="ulList" className='playListCon mainPlaylistCon' onClick={self.evVpn.bind(self)}>
                {
                    this.state.playList.map(function (item, i) {
                        return <li className='mainplayListCon' data-songNum={i} key={i}>
                            <div className="mainPlaylistItem">
                                <img src={item.img} className="mainPlaylistImg"></img>
                                <div className="mainPlaylistName">{item.name}</div>
                                <div className="mainPlaylistArtist">{item.artist}</div>
                            </div>
                        </li>
                    })
                }

            </ul>
        );
    }
}

