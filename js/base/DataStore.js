//变量缓存器 方便我们在不同的类中访问修改变量
export  class DataStore{
  constructor(){
    this.map = new Map()
  }
  static getInstance() {

    if(!this.instance) {
      this.instance = new DataStore()
    }

    return this.instance
  }
  put(key,value) {
    if(typeof value === 'function') {
      value = new value
    }
    this.map.set(key,value)
    return this
  }
  get(key){
    return this.map.get(key)
  }

  destroy() {
    for(let value of this.map.values()){
      value = null
    }
  }
}
