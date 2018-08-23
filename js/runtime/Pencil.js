import { Sprite } from "../base/Sprite.js"
import { Director } from "../Director.js";
import { DataStore } from "../base/DataStore.js";
/**
 *铅笔的基类 
 */
export class Pencil extends Sprite{
  constructor(image,top) {
    super(image,0,0,image.width,image.height,DataStore.getInstance().canvas.width,0,image.width,image.height)
    this.top = top
  }
  draw() {
    this.x -= Director.getInstance().moveSpeed
    super.draw(this.img,0,0,this.img.width,this.img.widht,this.x,this.y,this.img.width,this.img.height)
  }
}