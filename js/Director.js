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
        const minTop = window.innerHeight / 8
        const maxTop = window.innerHeight / 2
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

    run() {
        if(this.isGameOver) {
            cancelAnimationFrame(this.dataStore.get('raf'))
            this.dataStore.destroy()
        }else{
            this.dataStore.get('background').draw()
            const pencils = this.dataStore.get('pencils')
            if(pencils[0].x + pencils[0].width <= 0 && pencils.length === 4){
                pencils.shift();
                pencils.shift();
            }
            if(pencils[0].x <= (window.innerWidth - pencils[0].width) / 2 && pencils.length === 2) {
                this.createPencil()
            }
            this.dataStore.get('pencils').forEach((value) => {
                value.draw()
            })
            this.dataStore.get('land').draw()
            this.createBird()
            this.raf = requestAnimationFrame(() => this.run())
            this.dataStore.put('raf',this.raf)
        }
    }
}