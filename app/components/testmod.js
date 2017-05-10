import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SingSdk from '5sing-sdk';
import fs from 'fs';
require('es6-promise').polyfill();
import fetch from 'isomorphic-fetch';
import Stopbtn from './stopbtn';
import UlList from './ullist';
import { songList as NsongList, getloggerproto } from './common';
import LoginPage from './loginPage';
var songList = NsongList;

var logger = getloggerproto();

function changeTime(time) {
    var min = 0, sec = 0;
    min = Math.floor(time / 60);
    sec = Math.floor(time % 60);
    if (sec < 10) {
        sec = '0' + sec;
    }
    return min + ':' + sec;
}
var isSingleHandle = true;
var timer = null;



class Main extends Component {
    constructor() {
        super();
        this.state = {
            currentTrackLen: songList.length,
            currentTrackIndex: 0,
            playStatus: false,
            isSingle: true
        }
        console.log(this.state)
    }
    getIniSongList() {
        //从从5sing上缓存的songList里重新解析缓存出问题的url，万一手贱删了缓存又没办法改回url时候用；
        var res = JSON.parse(fs.readFileSync('./songList.json', 'utf-8'));
        for (let i in res.data) {
            songList.push({
                name: res.data[i].SN,
                src: res.data[i].FN,
                artist: res.data[i].user.NN,
                img: res.data[i].user.I
            })
        }
    }
    componentDidMount() {
        console.log(this.props.data)
        this.updateSongList()
        this.bindEnd();
    }
    download() {
        var theSongWeDown = this.state.currentTrackIndex;
        console.log(theSongWeDown)
        var src = audio.getElementsByTagName("source")[0].src;
        var fileExtension = src.substring(src.lastIndexOf('.') + 1);
        var filename = src.substring(src.lastIndexOf("/") + 1, src.lastIndexOf("."));
        console.log(filename);
        var title = document.getElementsByClassName("title")[0].innerText;
        var resUrl = './cache/' + filename + '.' + fileExtension;
        fetch(audio.getElementsByTagName("source")[0].src).then(response => response.buffer())
            .then(data => fs.writeFileSync('./app/cache/' + filename + '.' + fileExtension, data))
            .then(e => { logger("下载成功") })
            .then(e => { songList[theSongWeDown].src = resUrl })
            .then(e => {
                var res = '{"songs": [';
                for (let i = 0; i < songList.length; i++) {
                    res += JSON.stringify(songList[i])
                    if (i < songList.length - 1) {
                        res += ','
                    }
                }
                res += ']}';
                fs.writeFileSync("./modyfiedSongList.json", res);
            })
            .catch(e => console.log("Oops, error", e))
    }
    updateSongList() {
        var res = JSON.parse(fs.readFileSync('./modyfiedSongList.json', 'utf-8'));
        songList = res.songs;
        // console.table(songList)
        this.refresh()
        //         SingSdk.getMySongs({
        //             userId: this.props.data.userId
        //         }, (res) => {
        //             for (let i in res.data) {
        //                 if(res.data[i].FN.indexOf("http://")===-1){
        //                     res.data[i].FN="http://data.5sing.kgimg.com/"+res.data[i].FN;
        //                     console.log(res.data[i].FN)
        //                 }
        //                 songList.push({
        //                     name: res.data[i].SN,
        //                     src: res.data[i].FN,
        //                     artist: res.data[i].user.NN,
        //                     img: res.data[i].user.I
        //                 })
        //             }

        //             fs.writeFileSync(`./songList.json`, JSON.stringify(res), 'utf8');
        //             this.refresh()
        //         }, (err) => { console.log(err) });
    }
    bindEnd() {
        document.getElementsByTagName("body")[0].addEventListener("ended", function (e) {
            if (!isSingleHandle) {
                document.getElementsByClassName("next")[0].click();
            }
            document.getElementById("audio").play();
        }, true)
        document.getElementsByTagName("body")[0].addEventListener("canplay", function (e) {
            clearInterval(timer);
            //console.log(timer);
            var now = 0,
                duration = e.target.duration,
                audio = e.target,
                progressBar = document.getElementsByClassName("progressBar")[0],
                ct = document.getElementsByClassName("ct")[0],
                tt = document.getElementsByClassName("tt")[0];
            tt.innerText = changeTime(duration);
            timer = setInterval(function () {
                ct.innerText = changeTime(audio.currentTime);
                var percent = Math.floor((audio.currentTime * 100 / duration));
                //console.log(percent);
                progressBar.style.width = percent + '%';
            }, 1000)
        }, true)
    }

    getInfo() {
        var index = this.state.currentTrackIndex;
        document.getElementsByClassName("artist")[0].innerText = songList[index].artist;
        var image = document.getElementsByClassName('cover')[0];
        var blurBg = document.getElementsByClassName('blurBg')[0];
        blurBg.src = songList[index].img;
        image.style.backgroundImage = "url(" + songList[index].img + ')';
        document.getElementsByClassName("title")[0].innerText = songList[index].name;
    }

    refresh(modle) {

        var nextindex = this.state.currentTrackIndex;
        if (modle) {
            if (modle == 'pre') {
                logger("←");
                nextindex = ((this.state.currentTrackIndex + songList.length) - 1) % songList.length;
            } else if (modle == 'next') {
                logger("→");
                nextindex = (this.state.currentTrackIndex + 1) % songList.length;
            }
            else {
                var nextindex = modle;
            }
        }
        this.state.currentTrackIndex = nextindex;

        this.refs.audio.innerHTML = '';
        console.log(decodeURI(songList[nextindex].src));
        this.refs.audio.innerHTML = '<audio id="audio"><source src=' + decodeURI(songList[nextindex].src) + ' type="audio/mpeg"></source></audio>'
        var audio = document.getElementById('audio');
        if (this.state.playStatus) {
            audio.play();
        } else {
            audio.pause();
        }
        this.getInfo();
    }

    playOrStop() {
        var audio = document.getElementById('audio');
        if (this.state.playStatus) {
            audio.pause();
        } else {
            audio.play();
        }

        this.state.playStatus = !this.state.playStatus;
        if (this.state.playStatus) {
            this.refs.pos.classList.add("play");
            this.refs.pos.classList.remove("stop");
            logger("play");
        } else {
            this.refs.pos.classList.add("stop");
            this.refs.pos.classList.remove("play");
            logger("pause");
        }
    }
    singleOrLoop() {
        this.state.isSingle = !this.state.isSingle;
        isSingleHandle = this.state.isSingle;
        if (isSingleHandle) {
            this.refs.sol.innerText = 'Single';
            logger("singleLoop");
        } else {
            this.refs.sol.innerText = 'Loop';
            logger("listLoop");
        }
    }
    random() {
        this.state.playStatus = true;
        let see = Math.random()
        this.refs.pos.classList.add("play");
        this.refs.pos.classList.remove("stop");
        see = Math.floor(see * songList.length - 1)
        this.refresh(see);
    }
    transform() {
        this.refs.con.scrollTop = 0;
        var ulList = document.getElementById("ulList");
        if (ulList.style.display == 'none') {
            ulList.style.display = 'block';
        } else { ulList.style.display = 'none'; }
        if (this.refs.mainListTittle.style.display == 'none') {
            this.refs.mainListTittle.style.display = 'block'
        } else { this.refs.mainListTittle.style.display = 'none'; }
        if (this.refs.random.style.display == 'none') {
            this.refs.random.style.display = 'block';
        } else { this.refs.random.style.display = 'none'; }
        if (this.refs.mainPlayerBase.style.display == 'none') {
            this.refs.mainPlayerBase.style.display = 'block';
        } else { this.refs.mainPlayerBase.style.display = 'none'; }
        this.refs.cover.classList.toggle("mainPlayerCover");
        this.refs.title.classList.toggle("mainPlayerTitle");
        this.refs.artist.classList.toggle("mainPlayerArtist");
        this.refs.progressCon.classList.toggle("mainPlayerProgressCon");
        this.refs.progressBar.classList.toggle("mainPlayerProgressBar");
        this.refs.pre.classList.toggle("mainPlayerPre");
        this.refs.next.classList.toggle("mainPlayerNext");
        this.refs.pos.classList.toggle("mainPlayerPlayStop");
        this.refs.blurBg.classList.toggle("mainPlayerBlurBg");
        this.refs.con.classList.toggle("mainPlayerCon");
    }
    play(num) {
        this.state.playStatus = true;
        this.refs.pos.classList.add("play");
        this.refs.pos.classList.remove("stop");
        console.log(num)
        this.refresh(num);
    }
    showMenu() {
        console.log("menuShow")
        this.refs.menuList.classList.toggle("menuListShow");
    }
    popLogin(){
        console.log("loginpoped")
        this.refs.loginPage.toggle();
    }
    render() {
        let self = this;
        return <div className="scroller">
            <div onClick={self.showMenu.bind(self)} className="menu"></div>
            <div ref="menuList" className='menuList'>
            <div className="selects">
            <button onClick={self.popLogin.bind(self)}>showLoginMenu</button>
            </div>
            <div onClick={self.showMenu.bind(self)} className="blank"></div>
            </div>
            <div ref="con" className='mainPlayerCon container'>
                <h2 ref="mainListTittle" className="mainListTittle">播放列表</h2>
                <UlList changeSong={self.play.bind(self)} />
                <div>
                    <div ref='cover' className='mainPlayerCover cover' onClick={self.transform.bind(self)}></div>
                    <img ref='blurBg' className='mainPlayerBlurBg blurBg'></img>
                    <p ref='title' className='title mainPlayerTitle'></p>
                    <div ref='artist' className='artist mainPlayerArtist'></div>
                    <div ref="progressCon" className=' mainPlayerProgressCon progressCon'><div ref="progressBar" className=' mainPlayerProgressBar progressBar'></div></div>
                    <p className="timeCon"><span className="ct"></span><span className="tt"></span></p>
                </div>
                <div ref="audio"><audio id="audio" controls='controls'></audio></div>
                <ul className='ctrl'>
                    <li ref="random" className="mainPlayerRandom" onClick={self.random.bind(self)}><img src="./img/random.png"></img></li>
                    <li ref="pre" className="mainPlayerPre pre" onClick={(pre) => { self.refresh('pre') }}></li>
                    <li ref="pos" className="mainPlayerPlayStop stop pos" onClick={self.playOrStop.bind(self)}></li>
                    <li ref="next" className='mainPlayerNext next' onClick={(next) => { self.refresh('next') }}></li>
                    <li className='down' onClick={(ev) => { self.download() }}>↓↓</li>
                    <li className='sol' ref="sol" onClick={self.singleOrLoop.bind(self)}>Single</li>
                </ul>
                <div ref="mainPlayerBase" className='mainPlayerBase'></div>
            </div>
            <LoginPage ref='loginPage'/>
        </div>
    }
}
//<Stopbtn onPlay={self.playOrStop.bind(self)} />
export default Main;