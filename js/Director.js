import { DataStore } from "./base/DataStore.js"
import { UpPencil } from "./runtime/UpPencil.js";
import { DownPencil } from "./runtime/DownPencil.js";
//导演类,控制游戏逻辑
export class Director {
    constructor(){
        this.dataStore = DataStore.getInstance()
        this.raf = null
        this.moveSpeed = 2
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new Director();
        }
        return this.instance;
    }

    createPencil() {
        const minTop = DataStore.getInstance().canvas.height / 8
        const maxTop = DataStore.getInstance().canvas.height / 2
        const top = minTop + Math.random() * (maxTop - minTop)
        this.dataStore.get('pencils').push(new UpPencil(top))
        this.dataStore.get('pencils').push(new DownPencil(top))
    }
    createBird() {
        this.dataStore.get('birds').draw()

    }
    birdsEvent() {
        for(let i=0;i<=2;i++) {
            this.dataStore.get('birds').y[i] = this.dataStore.get('birds').birdsY[i]
            this.dataStore.get('birds').time = 0
        }
    }

    static isStrike(bird,pencil) {
        let s = false
        if(bird.top >= pencil.bottom ||
            bird.bottom <= pencil.top ||
            bird.right <= pencil.left ||
            bird.left >= pencil.right
        ) {
            s = true
        }
        return !s
    }

    check() {
        const birds = this.dataStore.get('birds')
        const land = this.dataStore.get('land')
        const pencils = this.dataStore.get('pencils')
        const score = this.dataStore.get('score')
        if(birds.birdsY[0] + birds.birdsHeight[0] >= land.y){
            this.isGameOver = true
            return
        }

        //小鸟模型
        const birdsBorder = {
            top: birds.y[0],
            bottom: birds.birdsY[0] + birds.birdsHeight[0],
            left: birds.birdsX[0],
            right: birds.birdsX[0] + birds.birdsWidth[0]
        }
        const pencilsLen = pencils.length
        for(let i=0;i<pencilsLen;i++){
            const pencil = pencils[i]
            const pencilBorder = {
                top: pencil.y,
                bottom: pencil.y + pencil.height,
                left: pencil.x,
                right:pencil.x + pencil.width
            }

            if(Director.isStrike(birdsBorder,pencilBorder)){
                console.log('撞到水管了')
                this.isGameOver = true
                return
            }
        }

        if(birds.birdsX[0] > pencils[0].x + pencils[0].width && score.flag) {
            
            score.scoreNumber ++
            score.flag = false
            
        }
    }

    run() {
        this.check()
        if(this.isGameOver) {
            this.dataStore.destroy()

            cancelAnimationFrame(this.dataStore.get('raf'))
            this.dataStore.get('startButton').draw()
            wx.triggerGC()
        }else{
            this.dataStore.get('background').draw()
            const pencils = this.dataStore.get('pencils')
            if(pencils[0].x + pencils[0].width <= 0 && pencils.length === 4){
                pencils.shift();
                pencils.shift();
                this.dataStore.get('score').flag = true
            }
            if(pencils[0].x <= (DataStore.getInstance().canvas.width - pencils[0].width) / 2 && pencils.length === 2) {
                this.createPencil()
            }
            this.dataStore.get('pencils').forEach((value) => {
                value.draw()
            })
            this.dataStore.get('land').draw()
            this.dataStore.get('score').draw()
            this.createBird()
            this.raf = requestAnimationFrame(() => this.run())
            this.dataStore.put('raf',this.raf)
        }
    }
}