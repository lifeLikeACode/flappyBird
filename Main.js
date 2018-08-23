//出事话整个游戏的精灵，作为游戏开始的入口
import { ResourceLoader } from "./js/base/ResourceLoader.js"
import {Director} from "./js/Director.js"
import {BackGround} from "./js/runtime/BackGround.js"
import {Land} from "./js/runtime/Land.js"
import { DataStore } from "./js/base/DataStore.js"
import { Birds } from "./js/player/Birds.js";
import {StartButton} from "./js/player/StartButton.js";
import { Score } from "./js/player/Score.js";

export class Main {
    constructor() {
        this.canvas = wx.createCanvas()
        this.ctx = this.canvas.getContext('2d')
        this.dataStore = DataStore.getInstance()
        this.director = Director.getInstance()
        const loader = ResourceLoader.create()
        loader.onLoaded(map => this.onResourceFirstLoaded(map))
    }

    createBackgroundMusic(url) {
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.loop = true
      audio.src = url
      audio.play()
      console.log(1)
      console.log(audio)
    }

    onResourceFirstLoaded(map){
        this.dataStore.canvas = this.canvas
        this.dataStore.ctx = this.ctx
        this.dataStore.res = map
        this.createBackgroundMusic('./audios/bgm.mp3')
        this.init()
        
    }

    init() {
        this.director.isGameOver = false
        this.dataStore.put('background', BackGround)
                        .put('land',Land)
                        .put('pencils',[])
                        .put('birds',Birds)
                        .put('startButton', StartButton)
                        .put('score', Score)
        this.registerEvent()
        this.director.createPencil()
        this.director.run()
        
    }
    registerEvent() {
        // this.canvas.addEventListener('touchstart', e => {
        //     e.preventDefault()
        //     if(this.director.isGameOver){
        //         console.log('游戏开始')
        //         this.init()
        //     }else {
        //         this.director.birdsEvent()
        //     }
        // })
        wx.onTouchStart(() => {
          if (this.director.isGameOver) {
            console.log('游戏开始')
            this.init()
          } else {
            this.director.birdsEvent()
          }
        })
    }
}